#!/bin/bash

# Simple quick start script - runs everything in background
# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 BDD Visual Recorder - Quick Start${NC}"
echo ""

# Install if needed
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install > /dev/null 2>&1
    cd backend && npm install > /dev/null 2>&1 && cd ..
    cd backend && npx playwright install chromium > /dev/null 2>&1 && cd ..
fi

# Clean ports
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Start servers
mkdir -p logs
cd backend && node server.js > ../logs/backend.log 2>&1 &
cd ..
npm run dev:frontend > logs/frontend.log 2>&1 &

sleep 3

# Detect port
PORT=5173
lsof -ti:5174 > /dev/null 2>&1 && PORT=5174

echo -e "${GREEN}✅ Ready!${NC}"
echo ""
echo -e "${GREEN}🌐 Open: http://localhost:${PORT}${NC}"
echo ""
echo -e "${YELLOW}To stop: ./stop.sh${NC}"
