#!/bin/bash

# Cloudflare Tunnel for Production Build
# Use this after running ./start-for-tunnel.sh

echo "🚀 Starting Cloudflare Tunnel (Production Mode)..."
echo ""
echo "📝 Make sure you ran './start-for-tunnel.sh' first!"
echo ""
echo "🌐 Creating tunnel for frontend (localhost:4173)..."
echo ""

# Start cloudflare tunnel for preview build
cloudflared tunnel --url http://localhost:4173
