#!/bin/bash

# Cloudflare Tunnel Script for BDD Visual Recorder
# This creates a public URL to share your local application (UI only)

echo "🚀 Starting Cloudflare Tunnel (Frontend Only)..."
echo ""
echo "📝 Note: Make sure your application is running first!"
echo "   Run './start.sh' in another terminal if not already running"
echo ""
echo "⚠️  This tunnels only the UI (port 5173)"
echo "   Backend features will only work on your local machine"
echo ""
echo "💡 For full remote access, use: ./tunnel-full.sh"
echo ""
echo "🌐 Creating tunnel for frontend (localhost:5173)..."
echo ""

# Start cloudflare tunnel for frontend
cloudflared tunnel --url http://localhost:5173
