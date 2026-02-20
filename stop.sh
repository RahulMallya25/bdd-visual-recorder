#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping BDD Visual Recorder Studio...${NC}"
echo ""

# Kill processes from PID file if it exists
if [ -f ".pids" ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid 2>/dev/null
            echo -e "${GREEN}✓ Stopped process $pid${NC}"
        fi
    done < .pids
    rm -f .pids
fi

# Kill any processes on the ports
echo -e "${YELLOW}🧹 Cleaning up ports...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Freed port 3001${NC}" || true
lsof -ti:5173 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Freed port 5173${NC}" || true
lsof -ti:5174 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Freed port 5174${NC}" || true

echo ""
echo -e "${GREEN}✅ All servers stopped${NC}"
