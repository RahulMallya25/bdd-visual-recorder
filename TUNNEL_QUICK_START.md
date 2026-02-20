# Cloudflare Tunnel - Quick Start 🚀

## Option 1: Quick Demo (Easiest)

```bash
# Terminal 1: Start app
./start.sh

# Terminal 2: Start tunnel
./tunnel.sh
```

**Share the URL that appears!** ✨

Others can see the UI, you control everything locally.

---

## Option 2: Full Remote Access

```bash
# Terminal 1: Start app
./start.sh

# Terminal 2: Start tunnels
./tunnel-full.sh
```

**Follow the instructions shown to update App.tsx**

Then rebuild and share the frontend URL!

---

## Stop Tunnels

```bash
./tunnel-stop.sh
```

Or press `Ctrl+C`

---

## Files Created

- `tunnel.sh` - Quick UI-only tunnel
- `tunnel-full.sh` - Full access with both frontend and backend
- `tunnel-stop.sh` - Stop all tunnels
- `SHARE_YOUR_APP.md` - Complete guide
- `TUNNEL_SETUP.md` - Technical details

---

## What You Need

✅ Application running (`./start.sh`)
✅ cloudflared installed (auto-installed if missing)
✅ Internet connection

---

**That's it!** Choose your option and start sharing! 🎉
