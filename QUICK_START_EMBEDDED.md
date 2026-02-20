# Quick Start - Embedded Browser

## What's New? 🎉

The browser now opens **inside the application** instead of as a separate window!

## Start the Application

```bash
./start.sh
```

This will:
- Start the backend server on port 3001
- Start the frontend on port 5173
- Open your browser automatically

## Using the Embedded Browser

### 1. Launch Browser
- Enter a URL in the header (e.g., `https://qa.loopay.com.pl/login`)
- Click the **Launch** button
- Browser appears embedded in the left panel

### 2. Interact with Browser
- Click directly on the embedded browser canvas
- The page will respond to your clicks
- Navigation and interactions work normally

### 3. Record Steps
- Fill in the step text (e.g., "user enters credentials")
- Click the **Record** button (🔴)
- Interact with the embedded browser
- Actions are captured automatically
- Click **Stop** when done

### 4. View Captured Actions
- Click the **View** button to see captured actions
- Shows all clicks, inputs, and interactions
- Action count displayed on button (e.g., "View (3)")

### 5. Generate Code
- Click **Save** to generate BDD code
- View Gherkin, Page Objects, Step Definitions
- Click **Export** to download complete framework

## Tips

✅ Browser stays open between steps - no need to relaunch
✅ Click anywhere on the canvas to interact
✅ Recording captures all interactions automatically
✅ Use meaningful step descriptions for better code generation
✅ Browser updates in real-time (2 FPS)

## Troubleshooting

**Browser not appearing?**
- Check backend is running (port 3001)
- Check browser console for errors
- Try refreshing the page

**Clicks not working?**
- Make sure browser is fully loaded
- Wait for screenshot to appear
- Check backend logs for errors

**Recording not capturing?**
- Click Record button first
- Interact with embedded browser
- Check View button for action count

## Stop the Application

```bash
./stop.sh
```

---

Enjoy your embedded browser experience! 🚀
