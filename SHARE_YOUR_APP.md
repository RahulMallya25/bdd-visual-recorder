# Share Your BDD Visual Recorder 🌐

## Quick Share (UI Demo Only)

Perfect for showing the interface to others while you control it locally.

### Steps:

1. **Start your application:**
   ```bash
   ./start.sh
   ```

2. **Start the tunnel (in a new terminal):**
   ```bash
   ./tunnel.sh
   ```

3. **Copy and share the URL:**
   ```
   https://random-name-1234.trycloudflare.com
   ```

**What works:** Others can see the UI
**What doesn't work:** Recording, browser launch (only works on your machine)

---

## Full Remote Access

For complete functionality where others can use all features.

### Steps:

1. **Start your application:**
   ```bash
   ./start.sh
   ```

2. **Start full tunnels (in a new terminal):**
   ```bash
   ./tunnel-full.sh
   ```

3. **You'll see output like:**
   ```
   ✅ Backend Tunnel: https://abc-123.trycloudflare.com
   ✅ Frontend Tunnel: https://xyz-789.trycloudflare.com
   
   📋 IMPORTANT: Update src/App.tsx with the backend URL
   ```

4. **Update the code:**
   
   Open `src/App.tsx` and find line 14:
   ```typescript
   const newSocket = io('http://localhost:3001', {
   ```
   
   Change it to:
   ```typescript
   const newSocket = io('https://abc-123.trycloudflare.com', {
   ```
   (Use YOUR backend tunnel URL from step 3)

5. **Rebuild and restart:**
   ```bash
   # Stop the current app (Ctrl+C in the terminal running ./start.sh)
   
   # Rebuild
   npm run build
   
   # Start with preview mode
   npm run preview
   ```

6. **Share the frontend URL:**
   ```
   https://xyz-789.trycloudflare.com
   ```

**What works:** Everything! Full remote access to all features.

---

## Stop Tunnels

```bash
./tunnel-stop.sh
```

Or press `Ctrl+C` in the tunnel terminal.

---

## Comparison

| Feature | Quick Share (./tunnel.sh) | Full Access (./tunnel-full.sh) |
|---------|---------------------------|--------------------------------|
| View UI | ✅ | ✅ |
| Launch Browser | ❌ (local only) | ✅ |
| Record Steps | ❌ (local only) | ✅ |
| Generate Code | ❌ (local only) | ✅ |
| Export Framework | ❌ (local only) | ✅ |
| Setup Complexity | Easy | Moderate |
| Code Changes | None | Update App.tsx |

---

## Tips

### Tunnel URLs Change
Free Cloudflare tunnels generate random URLs each time. If you restart the tunnel, you'll get a new URL.

### Tunnel Expires
Free tunnels may expire after some time. Just restart to get a new URL.

### Security
- Tunnels are public - anyone with the URL can access
- Don't share sensitive data through tunnels
- Stop tunnels when done

### Performance
- Tunnels add latency
- Best for demos and testing
- For production, deploy to a cloud service

---

## Troubleshooting

### "cloudflared: command not found"
```bash
npm install -g cloudflared
```

### Tunnel not starting
- Make sure app is running first (`./start.sh`)
- Check if ports 5173 and 3001 are available
- Try restarting the tunnel

### WebSocket errors with full tunnel
- Make sure you updated App.tsx with correct backend URL
- Rebuild the app after changing App.tsx
- Check logs/tunnels/backend.log for backend tunnel URL

### Can't access the tunnel URL
- Wait 10-30 seconds after tunnel starts
- Try refreshing the page
- Check your internet connection

---

## Alternative: ngrok

If Cloudflare tunnel doesn't work, try ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Tunnel frontend
ngrok http 5173

# Tunnel backend (in another terminal)
ngrok http 3001
```

---

## Need Help?

Check the logs:
- Application: `logs/backend.log` and `logs/frontend.log`
- Tunnels: `logs/tunnels/backend.log` and `logs/tunnels/frontend.log`

---

**Ready to share!** 🚀
