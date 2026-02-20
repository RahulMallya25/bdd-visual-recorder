#!/bin/bash

# Ultimate Tunnel Solution - Serves built version (no host check issues!)

echo "🚀 BDD Visual Recorder - Production Tunnel Setup"
echo ""

# Build if needed
if [ ! -d "dist" ] || [ ! "$(ls -A dist 2>/dev/null)" ]; then
    echo "📦 Building production version..."
    npm run build
    echo ""
fi

# Stop existing processes
echo "🧹 Cleaning up..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "serve" 2>/dev/null
pkill -f "http-server" 2>/dev/null
sleep 1

# Create logs directory
mkdir -p logs

# Start backend
echo "🔧 Starting backend..."
cd backend && node server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
sleep 2

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "📦 Installing serve..."
    npm install -g serve
fi

# Start frontend with serve (no host check!)
echo "🌐 Starting frontend (production)..."
serve dist -l 5173 -n > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Save PIDs
echo $BACKEND_PID > .pids
echo $FRONTEND_PID >> .pids

# Wait for services
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Production Server Running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "📊 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🌐 Ready for tunneling!"
echo "   Run './tunnel.sh' in another terminal"
echo ""
echo "💡 This uses the production build - no host check issues!"
echo ""
echo "🛑 To stop: ./stop.sh"
echo ""
