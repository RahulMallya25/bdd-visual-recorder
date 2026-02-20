# 🛠️ BDD Visual Recorder - Tech Stack Documentation

## Overview

BDD Visual Recorder is a full-stack web application for recording browser interactions and generating BDD test automation code. It uses modern web technologies with real-time communication between frontend and backend.

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Header     │  │   Browser    │  │     Step     │      │
│  │  Component   │  │    Panel     │  │   Builder    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                    WebSocket (Socket.IO)                     │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                    Backend (Node.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Socket.IO   │  │  Playwright  │      │
│  │    Server    │  │    Server    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Code     │  │    Export    │  │  Screenshot  │      │
│  │  Generator   │  │   Service    │  │   Streaming  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework for building component-based interface |
| **TypeScript** | 5.2.0 | Type-safe JavaScript for better development experience |
| **Vite** | 5.0.0 | Fast build tool and dev server |
| **Zustand** | 4.4.0 | Lightweight state management |

### UI Components

| Component | Purpose |
|-----------|---------|
| **Header** | Project/scenario inputs, URL input, Launch/Save/Export buttons |
| **BrowserPanel** | Embedded browser preview with canvas rendering |
| **StepBuilder** | List of BDD steps with Record/View/Delete controls |
| **StepRow** | Individual step with keyword dropdown and text input |
| **CodeModal** | Modal displaying generated code with tabs and copy buttons |

### Key Libraries

- **@monaco-editor/react** (4.6.0) - Code editor for displaying generated code
- **socket.io-client** (4.6.0) - Real-time WebSocket communication
- **React Hooks** - useState, useEffect, useRef for component logic

### Styling

- **CSS Modules** - Component-scoped styling
- **Custom CSS** - Modern, clean UI with smooth animations
- **Responsive Design** - Works on desktop and mobile

---

## ⚙️ Backend Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime for server |
| **Express** | Latest | Web server framework |
| **Socket.IO** | Latest | Real-time bidirectional communication |
| **Playwright** | Latest | Browser automation and control |

### Backend Modules

#### 1. **server.js** - Main Server
- Express HTTP server
- Socket.IO WebSocket server
- Browser lifecycle management
- Event handling (launch, record, stop)
- Screenshot streaming (10 FPS)
- Mouse/keyboard event simulation

#### 2. **codeGenerator.js** - Code Generation
- **Gherkin** - BDD feature files
- **Page Object Model** - Reusable page classes
- **Step Definitions** - Cucumber step implementations
- **Raw Playwright** - Direct Playwright code
- Meaningful variable naming from locators

#### 3. **exportService.js** - Framework Export
- Creates complete test framework structure
- Generates package.json with dependencies
- Creates Cucumber configuration
- Exports as downloadable ZIP file

### Browser Automation

**Playwright Features Used:**
- Headless browser mode
- Screenshot capture (JPEG, 70% quality)
- Mouse click simulation
- Keyboard input simulation
- Element locator generation (getByTestId, getByRole, etc.)
- Page navigation
- Event injection

---

## 🔄 Integration & Communication

### WebSocket Events (Socket.IO)

#### Frontend → Backend

| Event | Payload | Purpose |
|-------|---------|---------|
| `launch-browser` | `{ url }` | Launch Playwright browser |
| `start-recording` | `{ stepIndex }` | Start recording user actions |
| `stop-recording` | `{ stepIndex }` | Stop recording and return actions |
| `browser-click` | `{ x, y }` | Simulate mouse click at coordinates |
| `browser-input` | `{ text }` | Simulate keyboard input |
| `browser-keypress` | `{ key }` | Simulate special key press |
| `generate-code` | `{ scenario }` | Generate BDD code |
| `export-framework` | `{ scenario }` | Export complete framework |

#### Backend → Frontend

| Event | Payload | Purpose |
|-------|---------|---------|
| `browser-launched` | `{ success }` | Browser launch status |
| `browser-screenshot` | `{ screenshot }` | Base64 JPEG screenshot |
| `recording-started` | `{ stepIndex }` | Recording started confirmation |
| `recording-stopped` | `{ stepIndex, actions }` | Recording stopped with captured actions |
| `action-captured` | `{ stepIndex, actions }` | Real-time action updates |
| `code-generated` | `{ gherkin, pageObject, ... }` | Generated code |
| `framework-exported` | `{ success, path }` | Export status |

### Data Flow

```
User Action → Frontend Component → WebSocket Event → Backend Handler
                                                            ↓
                                                    Playwright Browser
                                                            ↓
                                                    Action Capture
                                                            ↓
Backend Response ← WebSocket Event ← State Update ← Frontend Update
```

---

## 🎯 Key Features Implementation

### 1. Embedded Browser

**Technology:** Canvas + Screenshot Streaming

```typescript
// Frontend: Render screenshots on canvas
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};
img.src = screenshot; // Base64 JPEG from backend
```

```javascript
// Backend: Capture and stream screenshots
setInterval(async () => {
  const screenshot = await page.screenshot({ 
    type: 'jpeg',
    quality: 70 
  });
  const base64 = screenshot.toString('base64');
  socket.emit('browser-screenshot', { 
    screenshot: `data:image/jpeg;base64,${base64}` 
  });
}, 100); // 10 FPS
```

### 2. Action Recording

**Technology:** Playwright Event Injection

```javascript
// Inject event listeners into browser page
await page.evaluate(() => {
  document.addEventListener('click', async (e) => {
    const locator = getPlaywrightLocator(e.target);
    await window.__recordClick(locator, e.target.tagName);
  }, true);
  
  document.addEventListener('input', async (e) => {
    const locator = getPlaywrightLocator(e.target);
    await window.__recordInput(locator, e.target.value);
  }, true);
});
```

### 3. Locator Generation

**Priority Order:**
1. `getByTestId` - data-testid attribute
2. `getByRole` - ARIA role with accessible name
3. `getByLabel` - aria-label or associated label
4. `getByPlaceholder` - placeholder attribute
5. `getByText` - visible text content
6. `locator` - CSS selector fallback

### 4. Code Generation

**Meaningful Variable Names:**

```javascript
// Input: getByTestId('Adres e-mail')
// Output: adresEMailInput

function generateMeaningfulName(locator, actionType) {
  // Extract text from locator
  const text = extractTextFromLocator(locator);
  
  // Convert to camelCase
  const camelCase = toCamelCase(text);
  
  // Add suffix based on action
  const suffix = actionType === 'fill' ? 'Input' : 'Button';
  
  return camelCase + suffix;
}
```

### 5. Focus Management

**Smart Focus Handling:**

```typescript
// Only focus canvas when clicked
const handleCanvasClick = (e) => {
  canvas.focus();
  setIsFocused(true);
};

// Release focus when clicked outside
const handleCanvasBlur = () => {
  setIsFocused(false);
};
```

---

## 📦 Project Structure

```
bdd-visual-recorder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── BrowserPanel.tsx
│   │   │   ├── StepBuilder.tsx
│   │   │   ├── StepRow.tsx
│   │   │   └── CodeModal.tsx
│   │   ├── store/
│   │   │   └── useStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── server.js
│   ├── codeGenerator.js
│   ├── exportService.js
│   ├── exports/
│   └── package.json
│
├── start.sh
├── stop.sh
├── tunnel.sh
└── README.md
```

---

## 🚀 Build & Deployment

### Development

```bash
# Start development servers
./start.sh

# Frontend: http://localhost:5173 (Vite dev server)
# Backend: http://localhost:3001 (Node.js + Express)
```

### Production Build

```bash
# Build frontend
npm run build

# Output: dist/ folder with optimized assets
```

### Deployment Options

| Platform | Frontend | Backend |
|----------|----------|---------|
| **Vercel** | ✅ Static hosting | ❌ |
| **Netlify** | ✅ Static hosting | ❌ |
| **Railway** | ✅ | ✅ Full-stack |
| **Render** | ✅ | ✅ Full-stack |
| **Heroku** | ✅ | ✅ Full-stack |

---

## 🔧 Configuration Files

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.trycloudflare.com']
  }
})
```

### package.json (Frontend)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### package.json (Backend)
```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.18.0",
    "socket.io": "^4.6.0",
    "playwright": "^1.40.0"
  }
}
```

---

## 🌐 Network & Tunneling

### Local Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Network: `http://192.168.1.13:5173`

### Cloudflare Tunnel
```bash
./tunnel.sh
# Creates: https://random-words.trycloudflare.com
```

### CORS & Host Configuration
- Vite configured to accept Cloudflare tunnel domains
- Socket.IO configured for cross-origin requests
- Network interface exposed for LAN access

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Screenshot FPS | 10 FPS (100ms interval) |
| Screenshot Quality | 70% JPEG |
| WebSocket Latency | ~50-100ms |
| Build Size | ~213 KB (gzipped: 68 KB) |
| Initial Load | < 2 seconds |

---

## 🔐 Security Considerations

- ✅ No sensitive data stored
- ✅ Localhost-only backend by default
- ✅ CORS configured for known origins
- ✅ Input sanitization in code generation
- ⚠️ Tunnels are public (use with caution)
- ⚠️ No authentication (local development tool)

---

## 🎓 Learning Resources

### Technologies Used
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Playwright Documentation](https://playwright.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## 📝 Summary

**Frontend:** React + TypeScript + Vite + Zustand
**Backend:** Node.js + Express + Socket.IO + Playwright
**Communication:** WebSocket (Socket.IO)
**Browser:** Playwright (headless, screenshot streaming)
**Code Generation:** JavaScript (Gherkin, POM, Cucumber)
**Deployment:** Static frontend + Node.js backend

**Key Innovation:** Embedded browser using canvas + screenshot streaming, eliminating the need for external browser windows while maintaining full Playwright automation capabilities.

---

**Tech Stack Version:** 1.0.0
**Last Updated:** February 2026
