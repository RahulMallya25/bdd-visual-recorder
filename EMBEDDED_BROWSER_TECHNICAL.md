# 🎨 Embedded Browser - Technical Implementation

## The Challenge

Playwright browsers run as separate OS processes and cannot be directly embedded into a web page. Traditional approaches would show the browser in a separate window, which breaks the user experience.

## The Solution: Screenshot Streaming + Canvas Rendering

Instead of trying to embed the actual browser window, I stream screenshots from the headless Playwright browser and render them on an HTML5 Canvas element in real-time.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              BrowserPanel Component                 │    │
│  │                                                      │    │
│  │  ┌────────────────────────────────────────────┐   │    │
│  │  │         HTML5 Canvas Element               │   │    │
│  │  │                                             │   │    │
│  │  │  [Rendered Screenshot]                     │   │    │
│  │  │                                             │   │    │
│  │  └────────────────────────────────────────────┘   │    │
│  │         ↑                                           │    │
│  │         │ Base64 JPEG Images                       │    │
│  │         │                                           │    │
│  └─────────┼───────────────────────────────────────────┘    │
│            │                                                 │
│            │ WebSocket (Socket.IO)                          │
└────────────┼─────────────────────────────────────────────────┘
             │
┌────────────┼─────────────────────────────────────────────────┐
│            │          Backend (Node.js)                      │
│            ↓                                                 │
│  ┌─────────────────────────────────────────────────┐       │
│  │         Screenshot Capture Loop                  │       │
│  │                                                   │       │
│  │  setInterval(() => {                             │       │
│  │    screenshot = page.screenshot()                │       │
│  │    emit('browser-screenshot', screenshot)        │       │
│  │  }, 100ms)  // 10 FPS                            │       │
│  └─────────────────────────────────────────────────┘       │
│                        ↑                                     │
│  ┌─────────────────────────────────────────────────┐       │
│  │      Playwright Browser (Headless)               │       │
│  │                                                   │       │
│  │  • Runs in headless mode                         │       │
│  │  • No visible window                             │       │
│  │  • Full browser capabilities                     │       │
│  │  • Captures screenshots                          │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### 1. Backend: Playwright Browser Setup

**File:** `backend/server.js`

```javascript
// Launch Playwright in headless mode
browser = await chromium.launch({ 
  headless: true,  // ← Key: No visible window!
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

context = await browser.newContext({
  viewport: { width: 1200, height: 800 }  // Set viewport size
});

page = await context.newPage();
await page.goto(url);
```

**Why headless?**
- No separate browser window appears
- Runs in background
- Can still capture screenshots
- Full automation capabilities

### 2. Backend: Screenshot Streaming

**File:** `backend/server.js`

```javascript
function startScreenshotStream(socket) {
  // Clear any existing interval
  if (screenshotInterval) {
    clearInterval(screenshotInterval);
  }
  
  // Stream screenshots at 10 FPS (every 100ms)
  screenshotInterval = setInterval(async () => {
    if (page && socket.connected) {
      try {
        // Capture screenshot as JPEG
        const screenshot = await page.screenshot({ 
          type: 'jpeg',
          quality: 70  // Balance between quality and size
        });
        
        // Convert to base64
        const base64 = screenshot.toString('base64');
        
        // Send via WebSocket
        socket.emit('browser-screenshot', { 
          screenshot: `data:image/jpeg;base64,${base64}` 
        });
      } catch (error) {
        // Ignore errors (page might be navigating)
      }
    }
  }, 100);  // 10 FPS = 100ms interval
}
```

**Key Parameters:**
- **Type:** JPEG (smaller than PNG)
- **Quality:** 70% (good balance)
- **Interval:** 100ms (10 FPS - smooth enough, not too heavy)
- **Format:** Base64 data URI (easy to use in browser)

### 3. Frontend: Canvas Setup

**File:** `src/components/BrowserPanel.tsx`

```typescript
function BrowserPanel() {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Listen for screenshots from backend
  useEffect(() => {
    if (!socket) return;

    const handleScreenshot = ({ screenshot }: { screenshot: string }) => {
      setScreenshot(screenshot);
    };

    socket.on('browser-screenshot', handleScreenshot);

    return () => {
      socket.off('browser-screenshot', handleScreenshot);
    };
  }, [socket]);

  // Render screenshot on canvas when received
  useEffect(() => {
    if (screenshot && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        setCanvasSize({ width: img.width, height: img.height });
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
      };
      
      // Load base64 image
      img.src = screenshot;
    }
  }, [screenshot]);

  return (
    <div className="browser-panel">
      <canvas 
        ref={canvasRef} 
        className="browser-canvas"
        onClick={handleCanvasClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
    </div>
  );
}
```

**How it works:**
1. Receive base64 screenshot via WebSocket
2. Create Image object from base64 data
3. When image loads, set canvas dimensions
4. Draw image onto canvas using `drawImage()`
5. Repeat every 100ms for smooth updates

### 4. Frontend: User Interaction

**Mouse Clicks:**

```typescript
const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  
  // Calculate actual coordinates in browser viewport
  const scaleX = canvasSize.width / rect.width;
  const scaleY = canvasSize.height / rect.height;
  
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  // Send click to backend
  socket.emit('browser-click', { x, y });
  
  // Focus canvas for keyboard input
  canvas.focus();
};
```

**Keyboard Input:**

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
  e.preventDefault();
  
  if (e.key.length === 1) {
    // Regular character
    socket.emit('browser-input', { text: e.key });
  } else {
    // Special keys (Enter, Tab, Backspace, etc.)
    socket.emit('browser-keypress', { key: e.key });
  }
};
```

### 5. Backend: Simulating User Actions

**Mouse Clicks:**

```javascript
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
```

**Keyboard Input:**

```javascript
socket.on('browser-input', async ({ text }) => {
  if (page) {
    try {
      await page.keyboard.type(text);
    } catch (error) {
      console.error('Input error:', error);
    }
  }
});

socket.on('browser-keypress', async ({ key }) => {
  if (page) {
    try {
      await page.keyboard.press(key);
    } catch (error) {
      console.error('Keypress error:', error);
    }
  }
});
```

---

## 🎯 Key Technologies Used

### 1. HTML5 Canvas API

**Why Canvas?**
- ✅ Native browser support
- ✅ High performance rendering
- ✅ Pixel-perfect image display
- ✅ Can capture mouse/keyboard events
- ✅ Supports scaling and transformations

**Canvas Methods Used:**
```javascript
canvas.getContext('2d')  // Get 2D rendering context
ctx.drawImage(img, 0, 0) // Draw image at position
canvas.width = img.width // Set canvas dimensions
canvas.height = img.height
```

### 2. Playwright Screenshot API

**Why Playwright?**
- ✅ Fast screenshot capture
- ✅ Multiple format support (PNG, JPEG)
- ✅ Quality control
- ✅ Works in headless mode
- ✅ Captures full page or viewport

**Screenshot Options:**
```javascript
page.screenshot({
  type: 'jpeg',      // Format
  quality: 70,       // 0-100
  fullPage: false,   // Viewport only
  omitBackground: false
})
```

### 3. WebSocket (Socket.IO)

**Why WebSocket?**
- ✅ Real-time bidirectional communication
- ✅ Low latency (~50-100ms)
- ✅ Automatic reconnection
- ✅ Event-based architecture
- ✅ Binary data support

**Events Used:**
```javascript
// Backend → Frontend
socket.emit('browser-screenshot', { screenshot })

// Frontend → Backend
socket.emit('browser-click', { x, y })
socket.emit('browser-input', { text })
```

### 4. Base64 Encoding

**Why Base64?**
- ✅ Easy to transmit over WebSocket
- ✅ Can be used directly in Image src
- ✅ No need for file storage
- ✅ Works with data URIs

**Format:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
```

---

## 📊 Performance Optimization

### Screenshot Quality vs Size

| Quality | File Size | Visual Quality | FPS Impact |
|---------|-----------|----------------|------------|
| 100% | ~150 KB | Perfect | High |
| 80% | ~80 KB | Excellent | Medium |
| 70% | ~50 KB | Good | Low ✅ |
| 50% | ~30 KB | Fair | Very Low |

**Chosen:** 70% quality - Best balance

### Frame Rate

| FPS | Interval | Smoothness | Bandwidth |
|-----|----------|------------|-----------|
| 30 FPS | 33ms | Very Smooth | High |
| 20 FPS | 50ms | Smooth | Medium |
| 10 FPS | 100ms | Good ✅ | Low |
| 5 FPS | 200ms | Choppy | Very Low |

**Chosen:** 10 FPS - Smooth enough, low bandwidth

### Bandwidth Usage

```
Screenshot Size: ~50 KB
Frame Rate: 10 FPS
Bandwidth: 50 KB × 10 = 500 KB/s = ~4 Mbps
```

Acceptable for most internet connections!

---

## 🔄 Data Flow

### Screenshot Streaming

```
1. Playwright captures screenshot (JPEG, 70%)
   ↓
2. Convert to Base64 string
   ↓
3. Send via WebSocket to frontend
   ↓
4. Frontend receives Base64 data
   ↓
5. Create Image object from Base64
   ↓
6. Draw Image on Canvas
   ↓
7. Repeat every 100ms (10 FPS)
```

### User Interaction

```
1. User clicks on Canvas
   ↓
2. Calculate click coordinates (with scaling)
   ↓
3. Send coordinates via WebSocket to backend
   ↓
4. Backend receives coordinates
   ↓
5. Playwright simulates click at coordinates
   ↓
6. Browser updates
   ↓
7. New screenshot captured and sent
   ↓
8. Canvas updates with new screenshot
```

---

## 🎨 CSS Styling

**File:** `src/components/BrowserPanel.css`

```css
.browser-canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;  /* Maintain aspect ratio */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  outline: none;
  transition: box-shadow 0.2s ease;
  cursor: pointer;  /* Show it's interactive */
}

.browser-canvas:focus {
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
}

.browser-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;  /* Scroll if needed */
  position: relative;
  background: #fff;
}
```

---

## 🚀 Advantages of This Approach

### ✅ Pros

1. **No External Windows** - Everything in one interface
2. **Cross-Platform** - Works on any OS
3. **Remote Access** - Can be tunneled/deployed
4. **Full Control** - Complete Playwright capabilities
5. **Responsive** - Scales to fit container
6. **Interactive** - Click and type directly
7. **Recording** - Can capture all interactions

### ⚠️ Limitations

1. **Latency** - ~100-150ms delay (screenshot + network)
2. **Not Real-Time** - 10 FPS, not 60 FPS
3. **Bandwidth** - Requires ~4 Mbps
4. **One-Way Video** - Can't see cursor in real-time
5. **No Native Scrolling** - Must simulate scroll events

---

## 🔮 Alternative Approaches (Not Used)

### 1. VNC/noVNC
- **Pros:** Real-time, low latency
- **Cons:** Complex setup, requires VNC server

### 2. WebRTC Screen Sharing
- **Pros:** Very low latency, high FPS
- **Cons:** Complex, requires signaling server

### 3. Iframe Embedding
- **Pros:** Simple, native browser
- **Cons:** Can't embed Playwright, CORS issues

### 4. Browser Extensions
- **Pros:** Direct browser access
- **Cons:** Requires installation, limited to Chrome

**Why Screenshot Streaming?**
- ✅ Simple to implement
- ✅ Works with Playwright
- ✅ No additional dependencies
- ✅ Good enough performance
- ✅ Easy to deploy

---

## 📝 Summary

**Core Technology:** HTML5 Canvas + Playwright Screenshots + WebSocket

**How It Works:**
1. Playwright browser runs headless (no window)
2. Backend captures screenshots every 100ms
3. Screenshots sent to frontend via WebSocket
4. Frontend renders screenshots on Canvas
5. User interactions sent back to backend
6. Playwright simulates interactions
7. Cycle repeats for real-time feel

**Key Innovation:** Treating the browser as a "video stream" rather than trying to embed the actual window, enabling a fully integrated experience while maintaining all Playwright automation capabilities.

---

**Implementation Files:**
- `backend/server.js` - Screenshot capture & streaming
- `src/components/BrowserPanel.tsx` - Canvas rendering & interaction
- `src/components/BrowserPanel.css` - Styling

**Performance:** 10 FPS, 70% JPEG quality, ~4 Mbps bandwidth
