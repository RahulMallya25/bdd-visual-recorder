# 🎯 Visual Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT OVERVIEW                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   GitHub     │────────▶│   Railway    │◀────────│   Vercel     │
│  (Source)    │         │  (Backend)   │         │  (Frontend)  │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
  Your Code              Node.js Server            React App
  Repository             + Playwright              + TypeScript
                         + WebSocket               + Vite


┌─────────────────────────────────────────────────────────────┐
│                    STEP-BY-STEP FLOW                         │
└─────────────────────────────────────────────────────────────┘

STEP 1: Deploy Backend to Railway
┌─────────────────────────────────────────┐
│  Railway Dashboard                       │
│  ├─ New Project                          │
│  ├─ Deploy from GitHub                   │
│  ├─ Select: bdd-visual-recorder          │
│  ├─ Settings:                            │
│  │   ├─ Root Directory: backend          │
│  │   └─ Start Command: node server.js    │
│  └─ Generate Domain                      │
│      └─ Get URL: https://xxx.railway.app │
└─────────────────────────────────────────┘
                    │
                    ▼
         COPY THIS URL! 📋


STEP 2: Configure Vercel Environment
┌─────────────────────────────────────────┐
│  Vercel Dashboard                        │
│  ├─ Settings                             │
│  ├─ Environment Variables                │
│  ├─ Add New:                             │
│  │   ├─ Name: VITE_BACKEND_URL           │
│  │   ├─ Value: [Railway URL from Step 1] │
│  │   └─ Environment: All ✓               │
│  └─ Save                                 │
└─────────────────────────────────────────┘
                    │
                    ▼
         Environment Set! ✅


STEP 3: Redeploy Frontend
┌─────────────────────────────────────────┐
│  Terminal or Vercel Dashboard            │
│  ├─ Option A: vercel --prod              │
│  └─ Option B: Deployments → Redeploy     │
│                                          │
│  Build Process:                          │
│  ├─ Install dependencies                 │
│  ├─ Use VITE_BACKEND_URL env var         │
│  ├─ Build React app                      │
│  └─ Deploy to CDN                        │
│      └─ Get URL: https://xxx.vercel.app  │
└─────────────────────────────────────────┘
                    │
                    ▼
         Frontend Live! 🎉


STEP 4: Connect Backend to Frontend
┌─────────────────────────────────────────┐
│  Railway Dashboard                       │
│  ├─ Backend Service                      │
│  ├─ Variables Tab                        │
│  ├─ Add New:                             │
│  │   ├─ Name: FRONTEND_URL               │
│  │   └─ Value: [Vercel URL from Step 3]  │
│  └─ Auto-redeploy                        │
└─────────────────────────────────────────┘
                    │
                    ▼
         Fully Connected! 🔗


┌─────────────────────────────────────────────────────────────┐
│                    FINAL ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    Users     │
                    │  (Browser)   │
                    └──────┬───────┘
                           │
                           │ HTTPS
                           ▼
                    ┌──────────────┐
                    │   Vercel     │
                    │  (Frontend)  │
                    │              │
                    │ React + Vite │
                    └──────┬───────┘
                           │
                           │ WebSocket
                           │ (wss://)
                           ▼
                    ┌──────────────┐
                    │   Railway    │
                    │  (Backend)   │
                    │              │
                    │ Node.js +    │
                    │ Playwright   │
                    └──────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT VARIABLES                     │
└─────────────────────────────────────────────────────────────┘

Vercel (Frontend):
┌────────────────────────────────────────┐
│ VITE_BACKEND_URL                        │
│ = https://xxx.up.railway.app            │
│                                         │
│ Used by: src/App.tsx                    │
│ Purpose: Connect to backend WebSocket   │
└────────────────────────────────────────┘

Railway (Backend):
┌────────────────────────────────────────┐
│ FRONTEND_URL                            │
│ = https://xxx.vercel.app                │
│                                         │
│ Used by: backend/server.js              │
│ Purpose: CORS configuration             │
└────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    TESTING CHECKLIST                         │
└─────────────────────────────────────────────────────────────┘

1. Open App
   └─ Visit: https://bdd-visual-recorder.vercel.app
      └─ ✅ Page loads

2. Check Console
   └─ Press F12 → Console tab
      └─ ✅ See: "Connected to backend"

3. Test Launch
   └─ Enter URL: https://example.com
   └─ Click: 🚀 Launch
      └─ ✅ See: "Browser launched successfully!"

4. Test Recording
   └─ Add step: Given I am on the page
   └─ Click: ⏺ Record
   └─ Click in browser panel
      └─ ✅ Action captured

5. Test Code Generation
   └─ Click: 👁 View
      └─ ✅ See generated code

6. Test Export
   └─ Click: 📦 Export
      └─ ✅ Download framework


┌─────────────────────────────────────────────────────────────┐
│                    COST BREAKDOWN                            │
└─────────────────────────────────────────────────────────────┘

Vercel (Frontend):
├─ Free Tier: ✅ Included
├─ Bandwidth: ✅ Unlimited
├─ Builds: ✅ Unlimited
└─ Cost: $0/month

Railway (Backend):
├─ Free Credit: $5/month
├─ Usage: ~$0.20/day
├─ Monthly: ~$6/month
└─ First Month: FREE (trial credit)

Total: ~$1/month after free credits


┌─────────────────────────────────────────────────────────────┐
│                    QUICK COMMANDS                            │
└─────────────────────────────────────────────────────────────┘

# Deploy to Vercel
vercel --prod

# Check Vercel logs
vercel logs

# Check local build
npm run build

# Test locally
npm run dev

# Push to GitHub
git add -A
git commit -m "Update"
git push origin main


┌─────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING                           │
└─────────────────────────────────────────────────────────────┘

Problem: Build fails on Vercel
├─ Check: Environment variable is set
├─ Check: Variable name is VITE_BACKEND_URL
└─ Fix: Add variable in Vercel dashboard

Problem: Can't connect to backend
├─ Check: Railway backend is running
├─ Check: Backend URL is correct
└─ Fix: Update VITE_BACKEND_URL in Vercel

Problem: WebSocket fails
├─ Check: Using https:// (not http://)
├─ Check: FRONTEND_URL set in Railway
└─ Fix: Update both environment variables


┌─────────────────────────────────────────────────────────────┐
│                    SUCCESS INDICATORS                        │
└─────────────────────────────────────────────────────────────┘

✅ Railway shows: "Backend server running on port 3001"
✅ Vercel shows: "Build completed successfully"
✅ Browser console: "Connected to backend"
✅ Can launch browser and see canvas
✅ Can record actions and see them captured
✅ Can generate code in all formats
✅ Can export framework as ZIP


┌─────────────────────────────────────────────────────────────┐
│                    NEXT STEPS                                │
└─────────────────────────────────────────────────────────────┘

1. Follow START_HERE.md for step-by-step deployment
2. Test all features after deployment
3. Share your app URL with users
4. Monitor usage in dashboards
5. Add custom domain (optional)


Ready to deploy? Open START_HERE.md! 🚀
```
