# 🚀 Deployment Steps - Fixed Guide

## Current Status

✅ Code pushed to GitHub: https://github.com/RahulMallya25/bdd-visual-recorder
✅ Vercel project created: `bdd_visual_recorder`
❌ Build failed (need to fix)

---

## Step 1: Deploy Backend to Railway FIRST

### 1.1 Go to Railway

https://railway.app

### 1.2 Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `RahulMallya25/bdd-visual-recorder`

### 1.3 Configure Backend

1. Railway will create a service
2. Click on the service
3. Go to "Settings" tab
4. **Root Directory:** `backend`
5. **Start Command:** `node server.js`
6. Click "Deploy"

### 1.4 Generate Domain

1. Still in "Settings" tab
2. Scroll to "Networking" section
3. Click "Generate Domain"
4. You'll get a URL like: `https://bdd-visual-recorder-production-xxxx.up.railway.app`

**COPY THIS URL!** You need it for the next step.

---

## Step 2: Configure Vercel Environment Variable

### 2.1 Go to Vercel Dashboard

https://vercel.com/rahulmallya25s-projects/bdd_visual_recorder

### 2.2 Add Environment Variable

1. Click on your project: `bdd_visual_recorder`
2. Go to "Settings" tab
3. Click "Environment Variables" in left sidebar
4. Click "Add New"
5. Fill in:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://bdd-visual-recorder-production-xxxx.up.railway.app` (YOUR Railway URL)
   - **Environment:** Check all three (Production, Preview, Development)
6. Click "Save"

---

## Step 3: Redeploy Frontend

### 3.1 Trigger Redeploy

Option A - From Dashboard:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click "..." menu
4. Click "Redeploy"

Option B - From CLI:
```bash
vercel --prod
```

### 3.2 Wait for Build

Vercel will:
1. Pull latest code from GitHub
2. Use the environment variable you set
3. Build the project
4. Deploy it

This takes about 1-2 minutes.

### 3.3 Get Your URL

After successful deployment:
```
https://bdd-visual-recorder.vercel.app
```

Or the one Vercel gave you:
```
https://bddvisualrecorder-oc0slfd7w-rahulmallya25s-projects.vercel.app
```

---

## Step 4: Update Railway with Frontend URL

### 4.1 Go Back to Railway

https://railway.app

### 4.2 Add Environment Variable

1. Click on your backend service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://bdd-visual-recorder.vercel.app` (or your Vercel URL)
5. Click "Add"

Railway will automatically redeploy.

---

## Step 5: Test Your Deployment

### 5.1 Open Your App

```
https://bdd-visual-recorder.vercel.app
```

### 5.2 Check Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see: "Connected to backend" or "Attempting to connect to backend: https://..."

### 5.3 Test Functionality

1. Enter a URL (e.g., `https://example.com`)
2. Click "Launch" button
3. If it works, you're done! 🎉

---

## 🐛 Troubleshooting

### Build Still Fails on Vercel

**Check:**
1. Environment variable is set correctly
2. Variable name is exactly: `VITE_BACKEND_URL`
3. Value starts with `https://`

**Fix:**
```bash
# Rebuild locally to test
npm run build

# If it works, push again
git push

# Trigger Vercel redeploy
vercel --prod
```

### Can't Connect to Backend

**Check Railway Logs:**
1. Go to Railway dashboard
2. Click on backend service
3. Go to "Deployments" tab
4. Click latest deployment
5. View logs

**Common Issues:**
- Backend not started (check logs)
- Wrong URL in Vercel environment variable
- CORS not configured

**Fix:**
1. Verify backend URL is accessible:
   ```bash
   curl https://your-backend-url.up.railway.app
   ```
2. Update Vercel environment variable if needed
3. Redeploy

### WebSocket Connection Fails

**Check:**
1. Backend URL uses `https://` (not `http://`)
2. Environment variable is set in Vercel
3. CORS includes your frontend URL

**Fix:**
1. Update `FRONTEND_URL` in Railway
2. Redeploy both services

---

## 📋 Quick Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Environment variable added in Vercel
- [ ] Frontend redeployed
- [ ] Frontend URL added to Railway
- [ ] App tested and working
- [ ] URL shared with users

---

## 🎯 Your URLs

**Frontend (Share this!):**
```
https://bdd-visual-recorder.vercel.app
```

**Backend (Internal):**
```
https://bdd-visual-recorder-production-xxxx.up.railway.app
```

**Vercel Dashboard:**
```
https://vercel.com/rahulmallya25s-projects/bdd_visual_recorder
```

**Railway Dashboard:**
```
https://railway.app/dashboard
```

---

## 🔄 If You Need to Start Over

### Delete Vercel Project

```bash
vercel remove bdd_visual_recorder
```

### Delete Railway Project

1. Go to Railway dashboard
2. Click on project
3. Settings → Danger → Delete Project

### Redeploy

Follow steps 1-5 again.

---

## ✅ Success Criteria

When everything works:

1. ✅ Frontend loads at Vercel URL
2. ✅ Console shows "Connected to backend"
3. ✅ Can enter URL and click Launch
4. ✅ Browser panel shows "Browser launched successfully"
5. ✅ Can record steps
6. ✅ Can generate code

---

## 💡 Pro Tips

1. **Use Vercel CLI for faster deploys:**
   ```bash
   vercel --prod
   ```

2. **Check logs in real-time:**
   - Vercel: `vercel logs`
   - Railway: Dashboard → Deployments → View Logs

3. **Set up custom domain (optional):**
   - Vercel: Settings → Domains
   - Add your domain (e.g., `recorder.yourdomain.com`)

4. **Monitor usage:**
   - Vercel: Dashboard → Analytics
   - Railway: Dashboard → Metrics

---

## 🎉 After Successful Deployment

**Share your app:**
```
🎬 BDD Visual Recorder is now live!

Try it here: https://bdd-visual-recorder.vercel.app

Features:
✅ Record browser interactions
✅ Generate BDD test code automatically
✅ Export complete test frameworks
✅ No installation needed!
```

---

**Need help?** Check the logs in Vercel and Railway dashboards!
