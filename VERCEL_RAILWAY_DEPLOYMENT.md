# 🚀 Vercel + Railway Deployment Guide

## Overview

This guide will help you deploy:
- **Frontend** → Vercel (unlimited, free forever)
- **Backend** → Railway (500 hours/month free)

**Result:** `https://your-app.vercel.app` accessible to everyone!

---

## 📋 Prerequisites

- ✅ Code pushed to GitHub
- ✅ GitHub account
- ✅ 15 minutes of time

---

## Part 1: Deploy Backend to Railway

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `bdd-visual-recorder`
4. Railway will detect it's a Node.js project

### Step 3: Configure Backend

1. Railway will show your project
2. Click on the service
3. Go to "Settings" tab
4. Set **Root Directory**: `backend`
5. Set **Start Command**: `node server.js`
6. Click "Deploy"

### Step 4: Get Backend URL

1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy the URL (e.g., `https://bdd-backend-production.up.railway.app`)

**Save this URL!** You'll need it for the frontend.

### Step 5: Add Environment Variable (Optional)

1. Go to "Variables" tab
2. Add variable:
   - Name: `FRONTEND_URL`
   - Value: `https://your-app.vercel.app` (we'll update this later)
3. Click "Add"

### Step 6: Verify Backend

Open your backend URL in browser:
```
https://bdd-backend-production.up.railway.app
```

You should see: "Cannot GET /" (this is normal - backend is running!)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with GitHub.

### Step 3: Set Environment Variable

Create `.env.production`:

```bash
echo "VITE_BACKEND_URL=https://bdd-backend-production.up.railway.app" > .env.production
```

**Replace** `https://bdd-backend-production.up.railway.app` with YOUR backend URL from Railway!

### Step 4: Deploy to Vercel

```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? (Choose your account)
- Link to existing project? **N**
- Project name? `bdd-visual-recorder` (or your choice)
- Directory? `./` (press Enter)
- Override settings? **N**

Vercel will:
1. Build your project
2. Deploy it
3. Give you a URL

### Step 5: Add Environment Variable in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - Name: `VITE_BACKEND_URL`
   - Value: `https://bdd-backend-production.up.railway.app`
   - Environment: **Production**
5. Click "Save"

### Step 6: Redeploy

```bash
vercel --prod
```

This deploys to production with the environment variable.

### Step 7: Get Your URL

Vercel gives you:
```
https://bdd-visual-recorder.vercel.app
```

**This is your public URL!** Share it with users!

---

## Part 3: Update Railway with Frontend URL

### Step 1: Go Back to Railway

1. Open https://railway.app
2. Go to your project
3. Click on the backend service

### Step 2: Update Environment Variable

1. Go to "Variables" tab
2. Update `FRONTEND_URL`:
   - Value: `https://bdd-visual-recorder.vercel.app`
3. Click "Save"

### Step 3: Redeploy Backend

Railway will automatically redeploy with the new variable.

---

## ✅ Verification

### Test Your Deployment

1. **Open Frontend:**
   ```
   https://bdd-visual-recorder.vercel.app
   ```

2. **Check Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Should see: "Connected to backend"

3. **Test Functionality:**
   - Enter a URL
   - Click Launch
   - Should work!

### If Connection Fails

**Check Backend URL:**
```bash
# Test backend is accessible
curl https://bdd-backend-production.up.railway.app
```

**Check Environment Variable:**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Verify `VITE_BACKEND_URL` is set correctly

**Redeploy Frontend:**
```bash
vercel --prod
```

---

## 🎯 URLs Summary

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://bdd-visual-recorder.vercel.app` | User interface |
| **Backend** | `https://bdd-backend-production.up.railway.app` | API & WebSocket |

**Share the frontend URL with users!**

---

## 📊 What You Get

### Free Tier Benefits

**Vercel (Frontend):**
- ✅ Unlimited bandwidth
- ✅ Unlimited builds
- ✅ 100 GB bandwidth/month
- ✅ Global CDN
- ✅ Auto-deploy on git push
- ✅ Free forever!

**Railway (Backend):**
- ✅ 500 hours/month (~20 days 24/7)
- ✅ WebSocket support
- ✅ Playwright support
- ✅ Auto-deploy on git push
- ✅ Free tier

**Total Cost:** $0/month

---

## 🔄 Auto-Deploy Setup

### Vercel Auto-Deploy

Already set up! Every time you push to GitHub:
1. Vercel detects the push
2. Builds the frontend
3. Deploys automatically

### Railway Auto-Deploy

Already set up! Every time you push to GitHub:
1. Railway detects the push
2. Builds the backend
3. Deploys automatically

**Just push to GitHub and both deploy automatically!**

---

## 🔧 Making Changes

### Update Code

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push
```

**Both Vercel and Railway will auto-deploy!**

### Update Environment Variables

**Vercel:**
1. Dashboard → Project → Settings → Environment Variables
2. Update value
3. Redeploy: `vercel --prod`

**Railway:**
1. Dashboard → Project → Variables
2. Update value
3. Railway auto-redeploys

---

## 🎉 Success!

Your app is now live at:
```
https://bdd-visual-recorder.vercel.app
```

**Users can:**
- ✅ Access via link (no installation)
- ✅ Use simultaneously (multi-user)
- ✅ Record browser interactions
- ✅ Generate BDD code
- ✅ Export frameworks
- ✅ Available 24/7

**You don't need to:**
- ❌ Keep your computer running
- ❌ Manage servers
- ❌ Worry about crashes
- ❌ Pay anything (free tier)

---

## 🐛 Troubleshooting

### Frontend loads but can't connect to backend

**Check:**
1. Backend URL is correct in Vercel environment variables
2. Backend is running on Railway
3. CORS is configured correctly

**Fix:**
```bash
# Verify backend URL
echo $VITE_BACKEND_URL

# Redeploy frontend
vercel --prod
```

### Backend not responding

**Check Railway logs:**
1. Go to Railway dashboard
2. Click on backend service
3. Go to "Deployments" tab
4. Click latest deployment
5. View logs

**Common issues:**
- Port not set correctly (should be from `process.env.PORT`)
- Dependencies not installed
- Playwright not installed

### WebSocket connection fails

**Check:**
1. Backend URL uses `https://` (not `http://`)
2. CORS is configured with frontend URL
3. Socket.IO transports include 'polling'

---

## 📈 Monitoring

### Vercel Analytics

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Analytics" tab
4. See visitor stats, performance metrics

### Railway Metrics

1. Go to Railway dashboard
2. Click on your project
3. Go to "Metrics" tab
4. See CPU, memory, network usage

---

## 💰 Cost Management

### Free Tier Limits

**Vercel:**
- Unlimited (free forever)

**Railway:**
- 500 hours/month
- ~$5/month after that

**Monitor usage:**
1. Railway dashboard → Project → Usage
2. See hours used
3. Upgrade if needed ($5/month for unlimited)

---

## 🎯 Next Steps

1. ✅ Share your URL with users
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring
4. ✅ Add analytics
5. ✅ Collect feedback

---

## 📝 Quick Reference

### Deploy Commands

```bash
# Deploy frontend to Vercel
vercel --prod

# Check Vercel deployment
vercel ls

# View logs
vercel logs
```

### URLs

```bash
# Frontend
https://bdd-visual-recorder.vercel.app

# Backend
https://bdd-backend-production.up.railway.app

# Vercel Dashboard
https://vercel.com/dashboard

# Railway Dashboard
https://railway.app/dashboard
```

---

**Congratulations! Your app is now deployed and accessible to everyone!** 🎉

Share your URL: `https://bdd-visual-recorder.vercel.app`
