# 🌐 Free Deployment Guide - Multi-User Access

## Current Situation

✅ **Works locally:** Users must run `./start.sh` on their machine
❌ **Limited sharing:** Cloudflare tunnel requires your machine running
❌ **Single user:** Only you can use it at a time

## Goal

✅ **Public URL:** Users access via link (e.g., `https://your-app.com`)
✅ **Always available:** Backend runs 24/7 independently
✅ **Multi-user:** Multiple users can use simultaneously
✅ **Free hosting:** No cost!

---

## 🎯 Best Free Deployment Options

### Option 1: Railway (Recommended) ⭐

**Why Railway?**
- ✅ Free tier: 500 hours/month (enough for 24/7)
- ✅ Supports full-stack apps
- ✅ Auto-deploys from GitHub
- ✅ Handles both frontend and backend
- ✅ WebSocket support
- ✅ Easy setup

**Limitations:**
- Free tier has usage limits
- May sleep after inactivity (can be prevented)

**Steps:**

1. **Push to GitHub** (you're ready!)

2. **Sign up:** https://railway.app
   - Use GitHub to sign in

3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `bdd-visual-recorder`

4. **Configure:**
   - Railway auto-detects Node.js
   - Add start command: `npm run dev`
   - Set port: `5173` (frontend) and `3001` (backend)

5. **Deploy:**
   - Railway builds and deploys
   - Get public URL: `https://your-app.up.railway.app`

6. **Done!** Share the URL with users!

---

### Option 2: Render (Also Great) ⭐

**Why Render?**
- ✅ Free tier: 750 hours/month
- ✅ Full-stack support
- ✅ Auto-deploys from GitHub
- ✅ WebSocket support
- ✅ Custom domains

**Limitations:**
- Free tier spins down after 15 min inactivity
- Cold start takes ~30 seconds

**Steps:**

1. **Sign up:** https://render.com
   - Use GitHub to sign in

2. **Create Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure:**
   - Name: `bdd-visual-recorder`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**

4. **Add Backend Service:**
   - Create another Web Service
   - Root Directory: `backend`
   - Start Command: `node server.js`

5. **Environment Variables:**
   - Add `FRONTEND_URL` with your frontend URL

6. **Deploy!**
   - Get URLs for both services
   - Update frontend to use backend URL

---

### Option 3: Vercel (Frontend) + Railway (Backend)

**Best of both worlds!**

**Vercel for Frontend:**
- ✅ Unlimited bandwidth
- ✅ Super fast CDN
- ✅ Auto-deploys
- ✅ Free forever

**Railway for Backend:**
- ✅ WebSocket support
- ✅ Playwright support
- ✅ Always running

**Steps:**

1. **Deploy Frontend to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```
   - Follow prompts
   - Get URL: `https://your-app.vercel.app`

2. **Deploy Backend to Railway:**
   - Create new project
   - Deploy `backend` folder
   - Get URL: `https://your-backend.up.railway.app`

3. **Update Frontend:**
   - Change backend URL in `src/App.tsx`
   - Redeploy

---

### Option 4: Heroku (Classic)

**Why Heroku?**
- ✅ Well-established
- ✅ Easy deployment
- ✅ Good documentation

**Limitations:**
- ❌ Free tier removed (now paid only)
- Use alternatives above instead

---

## 🔧 Deployment Configuration

### For Railway/Render

Create `railway.json` or `render.yaml`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run dev",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Update Backend URL

**File:** `src/App.tsx`

```typescript
// Change from:
const backendUrl = 'http://localhost:3001';

// To:
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

**Add to `.env`:**
```
VITE_BACKEND_URL=https://your-backend.up.railway.app
```

---

## 🚀 Step-by-Step: Railway Deployment

### 1. Prepare Your Code

**Update `package.json`:**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "vite",
    "dev:backend": "cd backend && node server.js",
    "build": "tsc && vite build",
    "start": "npm run dev",
    "preview": "vite preview"
  }
}
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

### 3. Deploy to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects and deploys!

### 4. Get Your URL

Railway provides: `https://your-app-production.up.railway.app`

### 5. Share with Users!

Users can now access your app 24/7!

---

## 🌍 Multi-User Support

### Current Architecture

```
User 1 → Frontend → Backend → Playwright Browser (User 1's session)
User 2 → Frontend → Backend → Playwright Browser (User 2's session)
User 3 → Frontend → Backend → Playwright Browser (User 3's session)
```

### How It Works

Each user gets their own:
- ✅ WebSocket connection
- ✅ Playwright browser instance
- ✅ Recording session
- ✅ Generated code

**No conflicts!** Users are isolated.

### Scaling Considerations

**Free Tier Limits:**
- Railway: 500 hours/month
- Render: 750 hours/month
- Vercel: Unlimited (frontend only)

**For Heavy Usage:**
- Upgrade to paid tier ($5-10/month)
- Or use multiple free accounts
- Or deploy on your own VPS

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Railway** | 500 hrs/mo | $5/mo | Full-stack |
| **Render** | 750 hrs/mo | $7/mo | Full-stack |
| **Vercel** | Unlimited | $20/mo | Frontend |
| **Netlify** | Unlimited | $19/mo | Frontend |
| **Fly.io** | 3 VMs free | $5/mo | Backend |
| **Cloudflare Pages** | Unlimited | Free | Frontend |

**Recommended Combo (100% Free):**
- Frontend: Vercel (unlimited)
- Backend: Railway (500 hrs = 20 days 24/7)

---

## 🔒 Security Considerations

### For Public Deployment

1. **Add Authentication:**
   ```javascript
   // Simple password protection
   const PASSWORD = process.env.APP_PASSWORD;
   
   app.use((req, res, next) => {
     const auth = req.headers.authorization;
     if (auth === `Bearer ${PASSWORD}`) {
       next();
     } else {
       res.status(401).send('Unauthorized');
     }
   });
   ```

2. **Rate Limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use(limiter);
   ```

3. **Environment Variables:**
   - Never commit secrets
   - Use platform's environment variable settings

---

## 📊 Monitoring & Logs

### Railway
- Built-in logs viewer
- Metrics dashboard
- Alerts for downtime

### Render
- Real-time logs
- Health checks
- Email notifications

### Vercel
- Analytics dashboard
- Performance metrics
- Error tracking

---

## 🎯 Quick Start: Railway Deployment

### 1. One-Click Deploy

Add this button to your README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/bdd-visual-recorder)
```

### 2. Manual Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### 3. Done!

Get your URL:
```bash
railway domain
```

---

## 🌟 Best Practice: Hybrid Approach

### For Maximum Uptime & Free

**Setup:**
1. **Frontend:** Deploy to Vercel (unlimited, free forever)
2. **Backend:** Deploy to Railway (500 hrs/month free)
3. **Fallback:** Keep Render as backup backend

**Benefits:**
- ✅ Frontend always available
- ✅ Backend runs 20+ days/month free
- ✅ Can switch backends if needed
- ✅ Zero cost!

**Configuration:**

```typescript
// src/App.tsx
const BACKEND_URLS = [
  'https://primary-backend.up.railway.app',
  'https://backup-backend.onrender.com'
];

let currentBackendIndex = 0;

const connectToBackend = () => {
  const socket = io(BACKEND_URLS[currentBackendIndex], {
    reconnection: true,
    reconnectionAttempts: 3
  });
  
  socket.on('connect_error', () => {
    // Try next backend
    currentBackendIndex = (currentBackendIndex + 1) % BACKEND_URLS.length;
    connectToBackend();
  });
  
  return socket;
};
```

---

## 📝 Deployment Checklist

Before deploying:
- [ ] Push code to GitHub
- [ ] Update backend URL in frontend
- [ ] Add environment variables
- [ ] Test locally one more time
- [ ] Choose deployment platform
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Test deployed app
- [ ] Share URL with users!

---

## 🎉 After Deployment

### Share Your App

**Your app is now live at:**
```
https://your-app.vercel.app
```

**Users can:**
- ✅ Access via link (no installation)
- ✅ Use simultaneously (multi-user)
- ✅ Record browser interactions
- ✅ Generate BDD code
- ✅ Export frameworks

**You don't need to:**
- ❌ Keep your computer running
- ❌ Manage servers
- ❌ Worry about crashes
- ❌ Pay anything (free tier)

---

## 🚀 Recommended: Railway Deployment

**Why Railway is best for this project:**

1. **Full-stack support** - Frontend + Backend together
2. **WebSocket support** - Socket.IO works perfectly
3. **Playwright support** - Can run browser automation
4. **Auto-scaling** - Handles multiple users
5. **Free tier** - 500 hours/month
6. **Easy setup** - Deploy in 5 minutes

**Deploy now:**
```bash
# 1. Push to GitHub (done!)
# 2. Go to railway.app
# 3. Connect GitHub repo
# 4. Deploy!
# 5. Share URL with users!
```

---

## 💡 Pro Tips

1. **Keep backend alive:**
   - Add health check endpoint
   - Ping every 10 minutes
   - Prevents sleeping

2. **Optimize for free tier:**
   - Use efficient code
   - Close unused connections
   - Implement caching

3. **Monitor usage:**
   - Check platform dashboards
   - Set up alerts
   - Upgrade if needed

4. **Backup strategy:**
   - Deploy to 2 platforms
   - Switch if one goes down
   - Always have fallback

---

## 🎯 Summary

**Current:** Local only, single user
**After Deployment:** Public URL, multi-user, 24/7 available

**Best Free Option:**
- **Railway** for full-stack (recommended)
- Or **Vercel** (frontend) + **Railway** (backend)

**Cost:** $0/month (free tier)

**Setup Time:** 10-15 minutes

**Result:** Users get a link, use the app, no setup needed!

---

**Ready to deploy?** Follow the Railway steps above! 🚀
