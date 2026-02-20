# 🎬 BDD Visual Recorder Studio

A modern, open-source tool for recording browser interactions and automatically generating BDD (Behavior-Driven Development) test automation code. Built with React, TypeScript, Node.js, and Playwright.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.2.0-blue.svg)

## ✨ Features

- 🎯 **Visual Recording** - Record browser interactions with an embedded browser view
- 🤖 **Auto Code Generation** - Generate Gherkin, Page Object Model, Step Definitions, and raw Playwright code
- 🎨 **Modern UI** - Clean, intuitive interface built with React and TypeScript
- 🔄 **Real-time Updates** - See actions captured instantly as you interact
- 📦 **Framework Export** - Export complete test framework with all dependencies
- 🌐 **Remote Sharing** - Share your recorder via Cloudflare tunnels
- 🎭 **Playwright Integration** - Leverage Playwright's powerful automation capabilities
- 📝 **Smart Locators** - Intelligent element selection using best practices (testId, role, label, etc.)
- 🔍 **Meaningful Names** - Auto-generated variable names from element context

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bdd-visual-recorder.git
cd bdd-visual-recorder

# Install dependencies and start
./start.sh
```

The application will automatically:
- Install frontend dependencies
- Install backend dependencies
- Install Playwright browsers
- Start both servers

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## 📖 Usage

### 1. Launch Browser

1. Enter your **Project Name** (e.g., "Login Tests")
2. Enter your **Scenario Name** (e.g., "User Login")
3. Enter the **URL** to test (e.g., "https://example.com")
4. Click **🚀 Launch** button

The browser will appear embedded in the left panel!

### 2. Record Steps

1. Add a step description (e.g., "user enters credentials")
2. Select the BDD keyword (Given, When, Then, And)
3. Click **⏺ Record** button
4. Interact with the embedded browser (click, type, etc.)
5. Click **⏹ Stop** when done

### 3. View Captured Actions

Click the **👁 View** button to see all captured actions for that step.

### 4. Generate Code

Click **💾 Save** to generate:
- **Gherkin** - BDD feature file
- **Page Object Model** - Reusable page classes
- **Step Definitions** - Cucumber step implementations
- **Raw Playwright** - Direct Playwright code

Each tab has a **copy button** for easy code copying!

### 5. Export Framework

Click **📦 Export** to download a complete test framework with:
- All generated code
- package.json with dependencies
- Cucumber configuration
- Ready to run!

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **TypeScript** 5.2.0 - Type safety
- **Vite** 5.0.0 - Build tool
- **Zustand** 4.4.0 - State management
- **Socket.IO Client** - Real-time communication
- **Monaco Editor** - Code display

### Backend
- **Node.js** 20.x - Runtime
- **Express** - Web server
- **Socket.IO** - WebSocket server
- **Playwright** - Browser automation

### Key Innovation
**Embedded Browser:** Uses HTML5 Canvas + Screenshot Streaming to embed Playwright browser directly in the UI, eliminating external windows while maintaining full automation capabilities.

## 📁 Project Structure

```
bdd-visual-recorder/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── BrowserPanel.tsx
│   │   ├── StepBuilder.tsx
│   │   ├── StepRow.tsx
│   │   └── CodeModal.tsx
│   ├── store/              # State management
│   └── App.tsx             # Main app
├── backend/                # Backend source
│   ├── server.js          # Main server
│   ├── codeGenerator.js   # Code generation
│   └── exportService.js   # Framework export
├── start.sh               # Start script
├── stop.sh                # Stop script
└── tunnel.sh              # Cloudflare tunnel
```

## 🌐 Remote Sharing

Share your recorder with others using Cloudflare tunnels:

```bash
# Terminal 1: Start the app
./start.sh

# Terminal 2: Start tunnel
./tunnel.sh

# Share the generated URL!
```

## 🎯 Generated Code Examples

### Gherkin Feature File
```gherkin
Feature: User Login

  Scenario: User Login
    Given user is on login page
    When user enters credentials
    And user clicks login button
    Then user should be logged in
```

### Page Object Model
```javascript
class Page {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async fillEmailInput(value) {
    await this.emailInput.fill(value);
  }

  async fillPasswordInput(value) {
    await this.passwordInput.fill(value);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}
```

### Step Definitions
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { Page } = require('../pages/Page');

Given('user is on login page', async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  pageObject = new Page(page);
  await page.goto('https://example.com/login');
});

When('user enters credentials', async function () {
  await pageObject.fillEmailInput('user@example.com');
  await pageObject.fillPasswordInput('password123');
});
```

## 🔧 Configuration

### Vite Configuration
The app is configured to work with Cloudflare tunnels:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com']
  }
})
```

### Environment Variables
No environment variables required for basic usage!

## 📊 Performance

- **Screenshot FPS:** 10 FPS (smooth, low bandwidth)
- **Screenshot Quality:** 70% JPEG (good balance)
- **WebSocket Latency:** ~50-100ms
- **Build Size:** ~213 KB (gzipped: 68 KB)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Documentation

- [Tech Stack Details](TECH_STACK.md) - Complete technology documentation
- [Embedded Browser Technical](EMBEDDED_BROWSER_TECHNICAL.md) - How the embedded browser works
- [Tunnel Setup](TUNNEL_SETUP.md) - Remote sharing guide
- [Quick Reference](QUICK_REFERENCE.md) - Quick command reference

## 🐛 Troubleshooting

### Browser not launching?
```bash
# Reinstall Playwright browsers
npx playwright install
```

### Port already in use?
```bash
# Stop all processes
./stop.sh

# Start again
./start.sh
```

### Tunnel not working?
```bash
# Make sure app is running first
./start.sh

# Then start tunnel
./tunnel.sh
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev) - Browser automation
- [React](https://react.dev) - UI framework
- [Socket.IO](https://socket.io) - Real-time communication
- [Vite](https://vitejs.dev) - Build tool
- [Cucumber](https://cucumber.io) - BDD framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for the testing community**

⭐ Star this repo if you find it useful!
