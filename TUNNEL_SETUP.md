# Cloudflare Tunnel Setup 🌐

## Quick Start

### Step 1: Start Your Application
```bash
./start.sh
```

Wait for both frontend and backend to be running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Step 2: Start the Tunnel (in a new terminal)
```bash
./tunnel.sh
```

You'll see output like:
```
🚀 Starting Cloudflare Tunnel...
🌐 Creating tunnel for frontend (localhost:5173)...

Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://random-name-1234.trycloudflare.com
```

### Step 3: Share the Link
Copy the `https://random-name-1234.trycloudflare.com` URL and share it!

## Important Notes

### ⚠️ Current Limitation
The WebSocket connection to the backend (port 3001) is currently hardcoded to `localhost:3001`. This means:

✅ **Works**: People can see the UI through the tunnel
❌ **Doesn't Work**: WebSocket features (browser launch, recording) won't work for remote users

### 🔧 To Make It Fully Work

You have two options:

#### Option 1: Tunnel Both Ports (Recommended)

Run two tunnels in separate terminals:

**Terminal 1 - Frontend:**
```bash
cloudflared tunnel --url http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cloudflared tunnel --url http://localhost:3001
```

Then update `src/App.tsx` line 14 to use the backend tunnel URL:
```typescript
const newSocket = io('https://your-backend-tunnel-url.trycloudflare.com', {
  transports: ['websocket', 'polling']
});
```

#### Option 2: Use ngrok (Alternative)

Install ngrok and run:
```bash
ngrok http 5173  # Frontend
ngrok http 3001  # Backend (in another terminal)
```

## What Works Through Tunnel

### ✅ Currently Working
- Viewing the UI
- Seeing the layout
- Understanding the interface
- Reading documentation

### ❌ Not Working (Without Backend Tunnel)
- Launching browser
- Recording steps
- Generating code
- Exporting framework
- Real-time updates

## Full Setup for Remote Access

If you want everything to work for remote users:

1. **Start the application:**
   ```bash
   ./start.sh
   ```

2. **Create backend tunnel (Terminal 2):**
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```
   Copy the URL (e.g., `https://abc-123.trycloudflare.com`)

3. **Update App.tsx:**
   ```typescript
   const newSocket = io('https://abc-123.trycloudflare.com', {
     transports: ['websocket', 'polling']
   });
   ```

4. **Rebuild frontend:**
   ```bash
   npm run build
   npm run preview
   ```

5. **Create frontend tunnel (Terminal 3):**
   ```bash
   cloudflared tunnel --url http://localhost:4173
   ```
   Share this URL!

## Quick Demo Mode

For a quick demo where you control everything locally but share the view:

1. Start app: `./start.sh`
2. Start tunnel: `./tunnel.sh`
3. Share the tunnel URL
4. You control the app locally, others watch through the tunnel

## Troubleshooting

**Tunnel not working?**
- Make sure app is running first
- Check firewall settings
- Try restarting the tunnel

**WebSocket errors?**
- Backend tunnel must be running
- Update App.tsx with correct backend URL
- Rebuild the frontend

**Tunnel URL expired?**
- Free Cloudflare tunnels expire after some time
- Just restart the tunnel to get a new URL

## Alternative: Deploy to Cloud

For permanent sharing, consider deploying to:
- Vercel (frontend)
- Railway/Render (backend)
- Heroku
- AWS/GCP/Azure

---

**Current Status:** Tunnel script ready for UI sharing. Backend tunnel needed for full functionality.
