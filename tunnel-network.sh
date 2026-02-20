#!/bin/bash

# Tunnel using network IP - bypasses Vite host check!

echo "🚀 Starting Cloudflare Tunnel (Network Address)..."
echo ""
echo "📝 Make sure your application is running first!"
echo "   Run './start.sh' in another terminal if not already running"
echo ""

# Get network IP
NETWORK_IP=$(hostname -I | awk '{print $1}')

if [ -z "$NETWORK_IP" ]; then
    echo "❌ Could not detect network IP"
    echo "   Using localhost instead..."
    NETWORK_IP="localhost"
fi

echo "🌐 Network IP: $NETWORK_IP"
echo "🌐 Tunneling: http://$NETWORK_IP:5173"
echo ""
echo "💡 This bypasses Vite's host check!"
echo ""

# Start cloudflare tunnel for network address
cloudflared tunnel --url http://$NETWORK_IP:5173
