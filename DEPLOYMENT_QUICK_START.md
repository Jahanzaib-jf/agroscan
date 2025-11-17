# AgroScan Deployment Quick Start

## 🚀 Quick Deployment Steps

### 1. Initialize Git & Push to GitHub

```powershell
cd C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean

# Initialize git
git init
git add .
git commit -m "Initial commit - AgroScan project"
git branch -M main

# Add your GitHub repo (create one first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/agroscan.git
git push -u origin main
```

### 2. Deploy Frontend to Netlify

```powershell
# Build the React app
cd agroscan-wheat-guardian-main\agroscan-wheat-guardian-main
npm run build
```

Then:
1. Go to [https://netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Select your GitHub repository
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**

Your site will be live at something like: `https://your-site-name.netlify.app`

### 3. Deploy Backend to Railway

1. Go to [https://railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Railway will auto-detect and deploy
5. Get your backend URL from Railway dashboard (looks like: `https://your-app.up.railway.app`)

### 4. Connect Frontend to Backend

In Netlify:
1. Go to **Site Settings** → **Build & deploy** → **Environment**
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app.up.railway.app` (your Railway backend URL)
3. Trigger redeploy

### 5. Test

Open your Netlify URL and try uploading a wheat leaf image!

---

## ⚠️ Important: Model Files

The `trained_models/*.keras` and `features/*.npy` files are large and shouldn't be pushed to GitHub.

### Option A: Use Git LFS (Recommended)

```powershell
# Install Git LFS
git lfs install

# Track large files
git lfs track "trained_models/*.keras"
git lfs track "features/*.npy"
git add .gitattributes
git commit -m "Enable Git LFS for model files"
git push
```

Then upload to Railway as usual.

### Option B: Upload Manually to Railway

If Git LFS doesn't work:
1. After deploying to Railway
2. In Railway console, upload files manually (or use SSH)

---

## 📋 Checklist

- [ ] GitHub account created
- [ ] GitHub repository pushed
- [ ] Netlify account created & frontend deployed
- [ ] Railway account created & backend deployed
- [ ] Backend URL set in Netlify environment
- [ ] Frontend redployed
- [ ] Test successful

---

## 🎉 You're Done!

Your app is now live on the internet! Share the Netlify URL with others.

---

## 📞 Support

- **Netlify Issues?** → https://docs.netlify.com/
- **Railway Issues?** → https://railway.app/support
- **Backend not responding?** → Check Railway logs for errors
- **Frontend not connecting?** → Check CORS and environment variables

