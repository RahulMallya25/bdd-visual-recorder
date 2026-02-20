# 📤 GitHub Push Guide

## Step-by-Step Instructions to Push to GitHub

### Step 1: Initialize Git Repository

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: BDD Visual Recorder Studio

- React + TypeScript frontend with Vite
- Node.js + Express + Socket.IO backend
- Playwright browser automation
- Embedded browser with canvas rendering
- Real-time screenshot streaming
- BDD code generation (Gherkin, POM, Step Definitions)
- Framework export functionality
- Cloudflare tunnel support
- Complete documentation"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `bdd-visual-recorder` (or your preferred name)
3. Description: "Visual BDD test recorder with embedded browser and auto code generation"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

### Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/bdd-visual-recorder.git
```

Or if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/bdd-visual-recorder.git
```

### Step 6: Verify Remote

```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/bdd-visual-recorder.git (fetch)
origin  https://github.com/YOUR_USERNAME/bdd-visual-recorder.git (push)
```

### Step 7: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### Step 8: Verify on GitHub

Go to your repository URL:
```
https://github.com/YOUR_USERNAME/bdd-visual-recorder
```

You should see all your files!

---

## 🔧 Quick Commands (All-in-One)

```bash
# Initialize and push (replace YOUR_USERNAME)
git init
git add .
git commit -m "Initial commit: BDD Visual Recorder Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bdd-visual-recorder.git
git push -u origin main
```

---

## 📝 Future Updates

After making changes:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🏷️ Adding Tags/Releases

```bash
# Create a tag
git tag -a v1.0.0 -m "First release"

# Push tag
git push origin v1.0.0

# Or push all tags
git push --tags
```

---

## 🌿 Working with Branches

```bash
# Create new branch
git checkout -b feature/new-feature

# Push branch
git push -u origin feature/new-feature

# Switch back to main
git checkout main

# Merge branch
git merge feature/new-feature
```

---

## 🔐 Authentication

### HTTPS (Username + Token)
- Username: Your GitHub username
- Password: Personal Access Token (not your GitHub password!)
- Create token: https://github.com/settings/tokens

### SSH (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys
```

---

## ❌ Troubleshooting

### "Permission denied"
- Check your authentication (token or SSH key)
- Make sure you have write access to the repository

### "Repository not found"
- Verify the repository URL
- Check if repository exists on GitHub
- Ensure you're using the correct username

### "Failed to push"
- Pull latest changes first: `git pull origin main`
- Resolve any conflicts
- Then push: `git push`

### Large files error
- Check .gitignore includes node_modules, dist, logs
- Remove large files: `git rm --cached large-file`
- Commit and push again

---

## 📋 Checklist

Before pushing:
- [ ] .gitignore is configured
- [ ] README.md is complete
- [ ] No sensitive data (API keys, passwords)
- [ ] node_modules is ignored
- [ ] Build artifacts are ignored
- [ ] All documentation is included

---

## 🎉 After Pushing

1. ✅ Add repository description on GitHub
2. ✅ Add topics/tags (react, typescript, playwright, bdd, testing)
3. ✅ Enable GitHub Pages (if needed)
4. ✅ Add repository to your profile
5. ✅ Share with the community!

---

**Your code is now on GitHub!** 🚀
