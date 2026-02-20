# Simple Tunnel Guide - Working Solution! ✅

## The Issue
The preview server (port 4173) wasn't starting properly, causing connection refused errors.

## The Solution
Use the regular dev server (port 5173) which works perfectly!

---

## Quick Start (Working Method)

### Step 1: Start the App
```bash
./start.sh
```

Wait for:
```
✅ Application is ready!
🌐 Frontend: http://localhost:5173
```

### Step 2: Start Tunnel (New Terminal)
```bash
./tunnel.sh
```

Copy the URL that appears:
```
https://your-unique-url.trycloudflare.com
```

### Step 3: Test on Another Device
Open the tunnel URL on your phone/tablet - it should work now!

---

## What You'll See

### On Remote Devices
- ✅ Complete UI loads
- ✅ Orange banner: "⚠️ Viewing in Demo Mode"
- ✅ All components visible
- ⚠️ Backend features disabled (Launch, Record won't work)

### Why Backend Features Don't Work
The backend runs on `localhost:3001` on your machine. Remote devices can't reach it.

**For full functionality**, you need to tunnel both ports (see tunnel-full.sh).

---

## Commands

### Start App
```bash
./start.sh
```

### Start Tunnel
```bash
./tunnel.sh
```

### Stop Everything
```bash
./stop.sh
./tunnel-stop.sh
```

---

## Troubleshooting

### "Connection Refused" Error
Make sure `./start.sh` is running first and shows "✅ Application is ready!"

### Blank Screen on Remote Device
1. Wait 30 seconds after tunnel starts
2. Refresh the page
3. Check browser console for errors
4. Try a different browser

### Tunnel Not Starting
```bash
# Check if app is running
lsof -i :5173

# Should show vite process
```

---

## Full Remote Access (Advanced)

If you want others to use ALL features:

```bash
# Terminal 1
./start.sh

# Terminal 2
./tunnel-full.sh

# Follow instructions to update App.tsx
```

---

**Status:** Working! Use `./start.sh` + `./tunnel.sh` for demo mode. 🎉
