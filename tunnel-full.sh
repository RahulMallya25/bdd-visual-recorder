#!/bin/bash

# Full Cloudflare Tunnel Script - Tunnels both frontend and backend
# This allows complete remote access to your application

echo "🚀 Starting Full Cloudflare Tunnel Setup..."
echo ""
echo "📝 Make sure your application is running first!"
echo "   Run './start.sh' in another terminal if not already running"
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared is not installed"
    echo "Installing cloudflared..."
    npm install -g cloudflared
fi

# Create a temporary directory for tunnel logs
mkdir -p logs/tunnels

echo "🌐 Starting Backend Tunnel (port 3001)..."
cloudflared tunnel --url http://localhost:3001 > logs/tunnels/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend tunnel to start
sleep 3

# Extract backend URL from log
BACKEND_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' logs/tunnels/backend.log | head -1)

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Backend tunnel starting... (check logs/tunnels/backend.log)"
    BACKEND_URL="(check logs/tunnels/backend.log)"
else
    echo "✅ Backend Tunnel: $BACKEND_URL"
fi

echo ""
echo "🌐 Starting Frontend Tunnel (port 5173)..."
cloudflared tunnel --url http://localhost:5173 > logs/tunnels/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a bit for frontend tunnel to start
sleep 3

# Extract frontend URL from log
FRONTEND_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' logs/tunnels/frontend.log | head -1)

if [ -z "$FRONTEND_URL" ]; then
    echo "⚠️  Frontend tunnel starting... (check logs/tunnels/frontend.log)"
    FRONTEND_URL="(check logs/tunnels/frontend.log)"
else
    echo "✅ Frontend Tunnel: $FRONTEND_URL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Tunnels Created!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 IMPORTANT: Update src/App.tsx with the backend URL:"
echo ""
echo "   Change line 14 from:"
echo "   const newSocket = io('http://localhost:3001', {"
echo ""
echo "   To:"
echo "   const newSocket = io('$BACKEND_URL', {"
echo ""
echo "   Then rebuild: npm run build && npm run preview"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Share this URL: $FRONTEND_URL"
echo ""
echo "📊 Tunnel Logs:"
echo "   Backend:  logs/tunnels/backend.log"
echo "   Frontend: logs/tunnels/frontend.log"
echo ""
echo "🛑 To stop tunnels: Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "⏳ Tunnels are running... (Press Ctrl+C to stop)"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .tunnel-pids
echo "$FRONTEND_PID" >> .tunnel-pids

# Wait for user to stop
wait
