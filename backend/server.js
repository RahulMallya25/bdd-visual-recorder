import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { chromium } from 'playwright';
import { generateCode } from './codeGenerator.js';
import { exportFramework } from './exportService.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { 
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

let browser = null;
let page = null;
let context = null;
let currentRecording = null;
let isRecording = false;
let recordingFunctions = new Set();
let cdpSession = null;
let screenshotInterval = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('launch-browser', async ({ url }) => {
    console.log('Launching browser for URL:', url);
    try {
      // Don't close if already open, just navigate
      if (browser && page) {
        console.log('Browser already open, navigating to new URL');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        socket.emit('browser-launched', { success: true });
        startScreenshotStream(socket);
        return;
      }
      
      // Launch browser in headless mode for true embedding
      browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
      });
      
      page = await context.newPage();
      
      // Enable Playwright Inspector highlighting
      await page.addInitScript(() => {
        // Inject Playwright-style highlighting
        const style = document.createElement('style');
        style.id = 'playwright-inspector-style';
        style.textContent = `
          .playwright-inspector-highlight {
            outline: 2px solid #ff4081 !important;
            outline-offset: 2px !important;
            background: rgba(255, 64, 129, 0.1) !important;
            cursor: pointer !important;
            position: relative !important;
          }
          
          .playwright-inspector-tooltip {
            position: absolute !important;
            bottom: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: #1a1a1a !important;
            color: #fff !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            border-radius: 4px !important;
            white-space: nowrap !important;
            z-index: 999999 !important;
            margin-bottom: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            pointer-events: none !important;
          }
          
          .playwright-inspector-tooltip::after {
            content: '' !important;
            position: absolute !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border: 6px solid transparent !important;
            border-top-color: #1a1a1a !important;
          }
          
          .playwright-recording-banner {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(90deg, #ff4081 0%, #f50057 100%) !important;
            color: white !important;
            padding: 12px 20px !important;
            text-align: center !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            z-index: 999998 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            animation: pulse 2s ease-in-out infinite !important;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
        `;
        
        if (document.head) {
          document.head.appendChild(style);
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
          });
        }
      });
      
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      console.log('Browser launched successfully - embedded mode');
      socket.emit('browser-launched', { success: true });
      
      // Start streaming screenshots to frontend
      startScreenshotStream(socket);
      
    } catch (error) {
      console.error('Browser launch error:', error);
      socket.emit('browser-launched', { success: false, error: error.message });
    }
  });

  socket.on('start-recording', async ({ stepIndex }) => {
    console.log('Starting recording for step:', stepIndex);
    
    if (!page) {
      console.error('No page available');
      socket.emit('recording-error', { error: 'No page available' });
      return;
    }
    
    if (isRecording) {
      console.log('Already recording, stopping previous recording first');
      await stopRecording();
    }
    
    currentRecording = { stepIndex, actions: [] };
    isRecording = true;
    
    try {
      // Add recording banner and enable highlighting
      await page.evaluate(() => {
        // Add banner
        if (!document.getElementById('playwright-recording-banner')) {
          const banner = document.createElement('div');
          banner.id = 'playwright-recording-banner';
          banner.className = 'playwright-recording-banner';
          banner.textContent = '🔴 RECORDING - Interact with the page';
          document.body.appendChild(banner);
        }
        
        // Generate Playwright-style locator
        window.getPlaywrightLocator = (el) => {
          const testId = el.getAttribute('data-test-id') || el.getAttribute('data-testid');
          if (testId) {
            return `getByTestId('${testId}')`;
          }

          const role = el.getAttribute('role');
          const tagName = el.tagName.toLowerCase();
          const text = el.textContent?.trim();
          
          if (tagName === 'button' || role === 'button') {
            if (text && text.length < 50) {
              return `getByRole('button', { name: '${text.substring(0, 30)}' })`;
            }
          }

          const ariaLabel = el.getAttribute('aria-label');
          if (ariaLabel) {
            return `getByLabel('${ariaLabel}')`;
          }

          if (tagName === 'input' || tagName === 'textarea') {
            const placeholder = el.getAttribute('placeholder');
            if (placeholder) {
              return `getByPlaceholder('${placeholder}')`;
            }
            
            const label = el.getAttribute('aria-label') || el.getAttribute('name');
            if (label) {
              return `getByLabel('${label}')`;
            }
          }

          if (text && text.length > 0 && text.length < 50) {
            return `getByText('${text.substring(0, 30)}')`;
          }

          const id = el.id;
          if (id) return `locator('#${id}')`;

          const name = el.getAttribute('name');
          if (name) return `locator('[name="${name}"]')`;

          const className = el.className;
          if (className && typeof className === 'string') {
            const classes = className.split(' ').filter(c => c && !c.startsWith('playwright'));
            if (classes.length > 0) {
              return `locator('.${classes[0]}')`;
            }
          }

          return `locator('${tagName}')`;
        };
        
        // Highlight on hover
        window.playwrightHighlight = (e) => {
          // Remove previous highlights
          document.querySelectorAll('.playwright-inspector-highlight').forEach(el => {
            el.classList.remove('playwright-inspector-highlight');
          });
          document.querySelectorAll('.playwright-inspector-tooltip').forEach(el => {
            el.remove();
          });
          
          const target = e.target;
          if (target && target.id !== 'playwright-recording-banner') {
            target.classList.add('playwright-inspector-highlight');
            
            // Add tooltip with locator
            const tooltip = document.createElement('div');
            tooltip.className = 'playwright-inspector-tooltip';
            tooltip.textContent = window.getPlaywrightLocator(target);
            target.appendChild(tooltip);
          }
        };
        
        document.addEventListener('mouseover', window.playwrightHighlight);
      });
      
      // Expose functions for recording (with unique names per session)
      const clickFnName = `__recordClick_${Date.now()}`;
      const inputFnName = `__recordInput_${Date.now()}`;
      
      recordingFunctions.add(clickFnName);
      recordingFunctions.add(inputFnName);
      
      await page.exposeFunction(clickFnName, async (locatorInfo, tagName) => {
        console.log('Click captured:', locatorInfo);
        if (currentRecording) {
          currentRecording.actions.push({
            type: 'click',
            locator: locatorInfo,
            tagName: tagName
          });
          socket.emit('action-captured', { 
            stepIndex: currentRecording.stepIndex,
            actions: currentRecording.actions 
          });
        }
      });
      
      await page.exposeFunction(inputFnName, async (locatorInfo, value, tagName) => {
        console.log('Input captured:', locatorInfo, value);
        if (currentRecording) {
          // Only add if value changed (avoid duplicate keystroke events)
          const lastAction = currentRecording.actions[currentRecording.actions.length - 1];
          if (!lastAction || lastAction.type !== 'fill' || lastAction.locator.value !== locatorInfo.value || lastAction.value !== value) {
            currentRecording.actions.push({
              type: 'fill',
              locator: locatorInfo,
              value: value,
              tagName: tagName
            });
            socket.emit('action-captured', { 
              stepIndex: currentRecording.stepIndex,
              actions: currentRecording.actions 
            });
          }
        }
      });
      
      // Add event listeners in browser context
      await page.evaluate(({ clickFn, inputFn }) => {
        const getLocatorInfo = (el) => {
          const locatorStr = window.getPlaywrightLocator(el);
          const type = locatorStr.startsWith('getBy') ? locatorStr.split('(')[0] : 'locator';
          return {
            type: type,
            value: locatorStr,
            code: `page.${locatorStr}`
          };
        };

        window.__clickHandler = async (e) => {
          const element = e.target;
          const locatorInfo = getLocatorInfo(element);
          const tagName = element.tagName.toLowerCase();
          await window[clickFn](locatorInfo, tagName);
        };
        
        window.__inputHandler = async (e) => {
          const element = e.target;
          const locatorInfo = getLocatorInfo(element);
          const value = element.value;
          const tagName = element.tagName.toLowerCase();
          await window[inputFn](locatorInfo, value, tagName);
        };
        
        document.addEventListener('click', window.__clickHandler, true);
        document.addEventListener('input', window.__inputHandler, true);
      }, { clickFn: clickFnName, inputFn: inputFnName });
      
      console.log('Recording started for step:', stepIndex);
      socket.emit('recording-started', { stepIndex });
      
    } catch (error) {
      console.error('Recording start error:', error);
      isRecording = false;
      socket.emit('recording-error', { error: error.message });
    }
  });

  async function stopRecording() {
    if (page && isRecording) {
      try {
        // Remove event listeners and banner
        await page.evaluate(() => {
          if (window.__clickHandler) {
            document.removeEventListener('click', window.__clickHandler, true);
          }
          if (window.__inputHandler) {
            document.removeEventListener('input', window.__inputHandler, true);
          }
          if (window.playwrightHighlight) {
            document.removeEventListener('mouseover', window.playwrightHighlight);
          }
          
          document.querySelectorAll('.playwright-inspector-highlight').forEach(el => {
            el.classList.remove('playwright-inspector-highlight');
          });
          document.querySelectorAll('.playwright-inspector-tooltip').forEach(el => {
            el.remove();
          });
          
          const banner = document.getElementById('playwright-recording-banner');
          if (banner) banner.remove();
        }).catch(err => console.error('Cleanup error:', err));
      } catch (err) {
        console.error('Stop recording error:', err);
      }
    }
    isRecording = false;
    recordingFunctions.clear();
  }

  socket.on('stop-recording', async ({ stepIndex }) => {
    console.log('Stopping recording for step:', stepIndex);
    
    await stopRecording();
    
    const actions = currentRecording?.actions || [];
    console.log('Recording stopped. Captured actions:', actions);
    console.log('Browser stays open for next step');
    
    socket.emit('recording-stopped', { 
      stepIndex,
      actions 
    });
    
    currentRecording = null;
  });

  socket.on('browser-click', async ({ x, y }) => {
    if (page) {
      try {
        await page.mouse.click(x, y);
        console.log(`Click at (${x}, ${y})`);
      } catch (error) {
        console.error('Click error:', error);
      }
    }
  });

  socket.on('browser-input', async ({ text }) => {
    if (page) {
      try {
        await page.keyboard.type(text);
        console.log(`Typed: ${text}`);
      } catch (error) {
        console.error('Input error:', error);
      }
    }
  });

  socket.on('browser-keypress', async ({ key }) => {
    if (page) {
      try {
        await page.keyboard.press(key);
        console.log(`Key pressed: ${key}`);
      } catch (error) {
        console.error('Keypress error:', error);
      }
    }
  });

  socket.on('generate-code', ({ scenario }) => {
    const code = generateCode(scenario);
    socket.emit('code-generated', code);
  });

  socket.on('export-framework', async ({ scenario }) => {
    try {
      const zipPath = await exportFramework(scenario);
      socket.emit('framework-exported', { success: true, path: zipPath });
    } catch (error) {
      socket.emit('framework-exported', { success: false, error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (screenshotInterval) {
      clearInterval(screenshotInterval);
      screenshotInterval = null;
    }
  });
});

// Function to stream screenshots to frontend
function startScreenshotStream(socket) {
  // Clear any existing interval
  if (screenshotInterval) {
    clearInterval(screenshotInterval);
  }
  
  // Stream screenshots at 10 FPS (every 100ms) for smoother experience
  screenshotInterval = setInterval(async () => {
    if (page && socket.connected) {
      try {
        const screenshot = await page.screenshot({ 
          type: 'jpeg',
          quality: 70 // Reduced quality for better performance
        });
        const base64 = screenshot.toString('base64');
        socket.emit('browser-screenshot', { screenshot: `data:image/jpeg;base64,${base64}` });
      } catch (error) {
        // Ignore screenshot errors (page might be navigating)
      }
    } else {
      clearInterval(screenshotInterval);
      screenshotInterval = null;
    }
  }, 100); // Changed from 500ms to 100ms for 10 FPS
}

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Browser will run in embedded mode with screenshot streaming');
  console.log('Using Playwright Inspector-style highlighting');
});
