#!/bin/bash

echo "🚀 Installing BDD Visual Recorder Studio..."

echo ""
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🎭 Installing Playwright browsers..."
npx playwright install chromium

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "The app will be available at http://localhost:5173"
