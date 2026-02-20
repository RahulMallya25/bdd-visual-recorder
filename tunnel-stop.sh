#!/bin/bash

# Stop Cloudflare Tunnels

echo "🛑 Stopping Cloudflare Tunnels..."

if [ -f .tunnel-pids ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "   Stopping tunnel (PID: $pid)"
            kill $pid 2>/dev/null
        fi
    done < .tunnel-pids
    rm .tunnel-pids
    echo "✅ Tunnels stopped"
else
    echo "⚠️  No tunnel PIDs found"
    echo "   Trying to kill all cloudflared processes..."
    pkill -f cloudflared
    echo "✅ Done"
fi

# Clean up log files
if [ -d logs/tunnels ]; then
    rm -rf logs/tunnels
    echo "🧹 Cleaned up tunnel logs"
fi
