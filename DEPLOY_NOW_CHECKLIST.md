# 🚀 DEPLOY NOW - Interactive Checklist

Follow these steps in order. Check off each one as you complete it.

---

## ⚡ STEP 1: Deploy Backend to Railway

### 1.1 Open Railway
🔗 **Click here:** https://railway.app

- [ ] Railway website opened
- [ ] Signed in with GitHub account

### 1.2 Create New Project
- [ ] Clicked "New Project" button
- [ ] Selected "Deploy from GitHub repo"
- [ ] Found and selected: `RahulMallya25/bdd-visual-recorder`
- [ ] Railway created a service (you should see it in the dashboard)

### 1.3 Configure Backend Service
- [ ] Clicked on the service card
- [ ] Clicked "Settings" tab
- [ ] Found "Root Directory" field
- [ ] Entered: `backend`
- [ ] Found "Start Command" field  
- [ ] Entered: `node server.js`
- [ ] Clicked "Deploy" or saved changes

### 1.4 Wait for Deployment
Watch the "Deployments" tab. You should see:
- [ ] Build started
- [ ] Build completed successfully
- [ ] Service is running
- [ ] Logs show: "Backend server running on port 3001"

### 1.5 Generate Domain
- [ ] Still in "Settings" tab
- [ ] Scrolled to "Networking" section
- [ ] Clicked "Generate Domain" button
- [ ] Domain generated (looks like: `https://bdd-visual-recorder-production-xxxx.up.railway.app`)

### 1.6 Copy Backend URL
📋 **COPY THIS URL NOW!**

Write it here: _______________________________________________

✅ **STEP 1 COMPLETE!**

---

## ⚡ STEP 2: Configure Vercel Environment Variable

### 2.1 Open Vercel Dashboard
🔗 **Click here:** https://vercel.com/rahulmallya25s-projects/bdd_visual_recorder

- [ ] Vercel dashboard opened
- [ ] Found your project: `bdd_visual_recorder`

### 2.2 Navigate to Environment Variables
- [ ] Clicked "Settings" tab (top navigation)
- [ ] Clicked "Environment Variables" in left sidebar

### 2.3 Add New Environment Variable
- [ ] Clicked "Add New" button
- [ ] Filled in the form:
  - **Name:** `VITE_BACKEND_URL`
  - **Value:** [Paste Railway URL from Step 1.6]
  - **Environment:** ✓ Production ✓ Preview ✓ Development (check all 3)
- [ ] Clicked "Save" button
- [ ] Confirmation message appeared

✅ **STEP 2 COMPLETE!**

---

## ⚡ STEP 3: Redeploy Frontend on Vercel

### Option A: From Terminal (Recommended)

Open your terminal in the project directory and run:

```bash
vercel --prod
```

- [ ] Command executed
- [ ] Vercel CLI started deployment
- [ ] Build started
- [ ] Build completed successfully
- [ ] Deployment URL shown

### Option B: From Vercel Dashboard

If you prefer using the dashboard:

- [ ] Went to "Deployments" tab
- [ ] Found the latest deployment
- [ ] Clicked "..." (three dots menu)
- [ ] Clicked "Redeploy"
- [ ] Confirmed redeploy
- [ ] Build started
- [ ] Build completed successfully

### 3.3 Verify Deployment
- [ ] Deployment shows "Ready" status
- [ ] Got deployment URL (e.g., `https://bdd-visual-recorder.vercel.app`)

Write your Vercel URL here: _______________________________________________

✅ **STEP 3 COMPLETE!**

---

## ⚡ STEP 4: Connect Backend to Frontend

### 4.1 Go Back to Railway
🔗 **Click here:** https://railway.app/dashboard

- [ ] Railway dashboard opened
- [ ] Found your backend service
- [ ] Clicked on the service

### 4.2 Add Frontend URL Variable
- [ ] Clicked "Variables" tab
- [ ] Clicked "New Variable" button
- [ ] Filled in:
  - **Name:** `FRONTEND_URL`
  - **Value:** [Paste Vercel URL from Step 3.3]
- [ ] Clicked "Add" button

### 4.3 Wait for Auto-Redeploy
Railway will automatically redeploy with the new variable:
- [ ] Redeploy started (check "Deployments" tab)
- [ ] Redeploy completed
- [ ] Service is running

✅ **STEP 4 COMPLETE!**

---

## 🎉 FINAL STEP: Test Your Deployment

### 5.1 Open Your App
🔗 **Open this URL:** https://bdd-visual-recorder.vercel.app

- [ ] App loaded successfully
- [ ] No error messages on screen

### 5.2 Check Browser Console
Press **F12** to open DevTools, then click "Console" tab:

- [ ] Console opened
- [ ] Found message: "Attempting to connect to backend: https://..."
- [ ] Found message: "Connected to backend" ✅

If you see "Connected to backend" - SUCCESS! 🎉

### 5.3 Test Functionality

**Test 1: Launch Browser**
- [ ] Entered URL: `https://example.com`
- [ ] Clicked "🚀 Launch" button
- [ ] Saw message: "Browser launched successfully!"
- [ ] Browser panel shows content

**Test 2: Record Action**
- [ ] Added a step (e.g., "Given I am on the page")
- [ ] Clicked "⏺ Record" button
- [ ] Clicked somewhere in the browser panel
- [ ] Action was captured (check step row)

**Test 3: Generate Code**
- [ ] Clicked "👁 View" button
- [ ] Code modal opened
- [ ] Saw generated Gherkin code
- [ ] Saw Page Object Model code
- [ ] All tabs working

**Test 4: Export Framework**
- [ ] Clicked "📦 Export" button
- [ ] Framework exported successfully

✅ **ALL TESTS PASSED!**

---

## 🎊 DEPLOYMENT COMPLETE!

### Your Live URLs

**Frontend (Share this!):**
```
https://bdd-visual-recorder.vercel.app
```

**Backend (Internal):**
```
[Your Railway URL]
```

### Share Your App

Copy and share this message:

```
🎬 BDD Visual Recorder is now LIVE!

Try it here: https://bdd-visual-recorder.vercel.app

✅ Record browser interactions visually
✅ Generate BDD test code automatically  
✅ Export complete test frameworks
✅ No installation required!

Built with React, TypeScript, Node.js, and Playwright
Open source: https://github.com/RahulMallya25/bdd-visual-recorder
```

---

## 📊 Deployment Summary

| Component | Platform | Status | URL |
|-----------|----------|--------|-----|
| Frontend | Vercel | ✅ Live | https://bdd-visual-recorder.vercel.app |
| Backend | Railway | ✅ Live | [Your Railway URL] |
| Source Code | GitHub | ✅ Public | https://github.com/RahulMallya25/bdd-visual-recorder |

---

## 💰 Monthly Cost

- Vercel: **FREE** (unlimited)
- Railway: **~$1/month** (after free credits)
- **Total: ~$1/month**

---

## 🆘 Troubleshooting

### ❌ Build Failed on Vercel
**Problem:** Build fails with environment variable error

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_BACKEND_URL` is set correctly
3. Make sure it starts with `https://`
4. Redeploy

### ❌ Can't Connect to Backend
**Problem:** Console shows connection errors

**Solution:**
1. Check Railway logs (Deployments → View Logs)
2. Verify backend is running (should see "Backend server running on port 3001")
3. Check `FRONTEND_URL` is set in Railway
4. Verify both URLs are correct

### ❌ WebSocket Connection Fails
**Problem:** Connected but features don't work

**Solution:**
1. Verify backend URL uses `https://` (not `http://`)
2. Check CORS settings in Railway logs
3. Clear browser cache and reload
4. Check Railway service is not sleeping

---

## 🎯 Next Steps

Now that your app is deployed:

1. ✅ Test all features thoroughly
2. ✅ Share the URL with your team
3. ✅ Monitor usage in dashboards
4. ✅ Consider adding a custom domain
5. ✅ Star the GitHub repo ⭐

---

**Congratulations! Your BDD Visual Recorder is now live! 🚀**
