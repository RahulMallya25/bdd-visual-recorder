#!/bin/bash

# 🚀 BDD Visual Recorder - Quick Deployment Commands

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║         🚀 BDD VISUAL RECORDER - DEPLOYMENT HELPER 🚀        ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

echo "📋 DEPLOYMENT CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "STEP 1: Deploy Backend to Railway"
echo "   🔗 Open: https://railway.app"
echo "   📝 Follow the guide in DEPLOY_NOW_CHECKLIST.md"
echo ""
read -p "   Have you deployed the backend and copied the Railway URL? (y/n): " backend_done

if [ "$backend_done" != "y" ]; then
    echo ""
    echo "⏸️  Please complete Step 1 first, then run this script again."
    echo "   Guide: DEPLOY_NOW_CHECKLIST.md"
    exit 0
fi

echo ""
read -p "   📋 Paste your Railway backend URL: " railway_url

if [ -z "$railway_url" ]; then
    echo ""
    echo "❌ Railway URL is required. Please run the script again."
    exit 1
fi

echo ""
echo "✅ Railway URL saved: $railway_url"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "STEP 2: Configure Vercel Environment Variable"
echo "   🔗 Open: https://vercel.com/rahulmallya25s-projects/bdd_visual_recorder"
echo ""
echo "   Add this environment variable:"
echo "   ┌────────────────────────────────────────────────────────┐"
echo "   │ Name:  VITE_BACKEND_URL                                 │"
echo "   │ Value: $railway_url"
echo "   │ Environment: ✓ Production ✓ Preview ✓ Development      │"
echo "   └────────────────────────────────────────────────────────┘"
echo ""
read -p "   Have you added the environment variable in Vercel? (y/n): " env_done

if [ "$env_done" != "y" ]; then
    echo ""
    echo "⏸️  Please add the environment variable in Vercel first."
    echo "   Then run this script again."
    exit 0
fi

echo ""
echo "✅ Environment variable configured!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "STEP 3: Deploy Frontend to Vercel"
echo "   🚀 Running: vercel --prod"
echo ""
read -p "   Ready to deploy? (y/n): " deploy_ready

if [ "$deploy_ready" != "y" ]; then
    echo ""
    echo "⏸️  Deployment cancelled. Run this script when ready."
    exit 0
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

vercel --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "STEP 4: Connect Backend to Frontend"
echo "   🔗 Open: https://railway.app/dashboard"
echo ""
echo "   Add this environment variable to your backend service:"
echo "   ┌────────────────────────────────────────────────────────┐"
echo "   │ Name:  FRONTEND_URL                                     │"
echo "   │ Value: https://bdd-visual-recorder.vercel.app           │"
echo "   └────────────────────────────────────────────────────────┘"
echo ""
echo "   (Or use your custom Vercel URL if different)"
echo ""
read -p "   Have you added FRONTEND_URL to Railway? (y/n): " frontend_url_done

if [ "$frontend_url_done" != "y" ]; then
    echo ""
    echo "⏸️  Please add FRONTEND_URL to Railway to complete deployment."
    exit 0
fi

echo ""
echo "✅ Backend connected to frontend!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "Your app is now live at:"
echo "   🌐 https://bdd-visual-recorder.vercel.app"
echo ""
echo "Test your deployment:"
echo "   1. Open the URL above"
echo "   2. Press F12 → Console"
echo "   3. Look for: 'Connected to backend'"
echo "   4. Try launching a browser and recording steps"
echo ""
echo "Share your app:"
echo "   🎬 BDD Visual Recorder is now LIVE!"
echo "   Try it: https://bdd-visual-recorder.vercel.app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Need help? Check these guides:"
echo "   - DEPLOY_NOW_CHECKLIST.md (step-by-step)"
echo "   - START_HERE.md (complete guide)"
echo "   - DEPLOYMENT_VISUAL.md (visual diagrams)"
echo ""
echo "🎊 Congratulations! Your app is deployed! 🎊"
echo ""
