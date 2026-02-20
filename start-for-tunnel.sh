#!/bin/bash

# Start application in production mode for tunneling
# This serves the built version which works better with tunnels

echo "🚀 Starting BDD Visual Recorder for Tunnel Sharing..."
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo "📦 Building application..."
    npm run build
    echo ""
fi

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite preview" 2>/dev/null

# Create logs directory
mkdir -p logs

# Start backend
echo "🔧 Starting backend server..."
cd backend && node server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start frontend in preview mode (serves the built version)
echo "🌐 Starting frontend (preview mode)..."
npm run preview > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Save PIDs
echo $BACKEND_PID > .pids
echo $FRONTEND_PID >> .pids

# Wait for services to start
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Application Started!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend: http://localhost:4173"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "📊 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🌐 Ready for tunneling!"
echo "   Run './tunnel.sh' in another terminal"
echo ""
echo "🛑 To stop: ./stop.sh"
echo ""
