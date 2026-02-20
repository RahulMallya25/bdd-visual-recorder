#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   BDD Visual Recorder Studio - Setup & Launch         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Check if dependencies are already installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend dependency installation failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

echo ""

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend dependency installation failed${NC}"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

echo ""

# Check if Playwright browsers are installed
if [ ! -d "backend/node_modules/playwright/.local-browsers" ] && [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo -e "${YELLOW}🎭 Installing Playwright browsers (this may take a few minutes)...${NC}"
    cd backend
    npx playwright install chromium
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Playwright browser installation failed${NC}"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}✓ Playwright browsers installed${NC}"
else
    echo -e "${GREEN}✓ Playwright browsers already installed${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Kill any existing processes on ports 3001 and 5173/5174
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true
sleep 1

echo ""
echo -e "${BLUE}🚀 Starting servers...${NC}"
echo ""

# Create log directory
mkdir -p logs

# Start backend server
echo -e "${YELLOW}⚙️  Starting backend server on port 3001...${NC}"
cd backend
node server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend server failed to start. Check logs/backend.log${NC}"
    exit 1
fi

echo ""

# Start frontend server
echo -e "${YELLOW}⚙️  Starting frontend server...${NC}"
npm run dev:frontend > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}⏳ Waiting for frontend to be ready...${NC}"
sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start. Check logs/frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Detect which port frontend is using
FRONTEND_PORT=5173
if lsof -ti:5174 > /dev/null 2>&1; then
    FRONTEND_PORT=5174
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Application is ready!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "${GREEN}⚙️  Backend:${NC}  http://localhost:3001"
echo ""
echo -e "${YELLOW}📝 Process IDs:${NC}"
echo -e "   Backend PID:  $BACKEND_PID"
echo -e "   Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "   Backend:  logs/backend.log"
echo -e "   Frontend: logs/frontend.log"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}💡 Usage Instructions:${NC}"
echo -e "   1. Open http://localhost:${FRONTEND_PORT} in your browser"
echo -e "   2. Enter Project Name, Scenario Name, and URL"
echo -e "   3. Click '🚀 Launch' to open Playwright browser"
echo -e "   4. Add steps and click '⏺ Record' to capture actions"
echo -e "   5. Click '👁 View' to see generated code"
echo -e "   6. Click '📦 Export' to download framework"
echo ""
echo -e "${RED}⚠️  To stop the servers, press Ctrl+C or run:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    rm -f .pids
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Keep script running and show logs
echo -e "${YELLOW}📊 Monitoring logs (Ctrl+C to stop):${NC}"
echo ""

# Follow logs
tail -f logs/backend.log logs/frontend.log
