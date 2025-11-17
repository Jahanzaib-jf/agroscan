# AgroScan - Deployment Guide (Netlify + Backend Hosting)

## Overview
This project has two components:
- **Frontend** (React/Vite) - Can be deployed to **Netlify**
- **Backend** (Flask) - Requires a separate server (Heroku, Railway, Render, AWS, DigitalOcean, etc.)

---

## Part 1: Deploy Frontend to Netlify

### Step 1: Build the React App

First, create a production build:

```powershell
cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main"
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Create a Netlify Account

1. Go to [https://netlify.com](https://netlify.com)
2. Click **Sign Up** and create an account (use GitHub for easier setup)
3. Verify your email

### Step 3: Connect GitHub Repository (Recommended)

#### Option A: Using GitHub (Automatic Deployment)

1. Push your project to GitHub:
   ```powershell
   cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main"
   
   git init
   git add .
   git commit -m "Initial commit - AgroScan project"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agroscan.git
   git push -u origin main
   ```

2. In Netlify Dashboard:
   - Click **"New site from Git"**
   - Select **GitHub**
   - Search for and select your `agroscan` repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **Deploy site**

Netlify will automatically rebuild whenever you push to GitHub.

#### Option B: Manual Deployment (Direct Upload)

1. In Netlify Dashboard, click **"Deploy manually"**
2. Drag and drop the `dist/` folder onto the deploy area
3. Your site goes live instantly with a random URL

### Step 4: Configure Environment Variables

Since the frontend needs to call the backend API, you need to set the correct backend URL.

1. In Netlify Dashboard → **Site Settings** → **Build & deploy** → **Environment**
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com` (will be set after backend deployment)

3. Update your `Services.tsx` to use this variable:

```typescript
// In src/pages/Services.tsx, change:
const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

// Then use it in fetch:
const response = await fetch(`${API_URL}/analyze`, {
  method: "POST",
  body: formData,
});
```

---

## Part 2: Deploy Backend to a Hosting Service

You have several options. I'll show the easiest ones:

### Option 1: Deploy to Railway.app (Recommended - Easiest)

#### Step 1: Prepare Backend for Production

1. Create `requirements.txt` in the project root:

```
tensorflow==2.14.0
flask==3.0.0
flask-cors==4.0.0
opencv-python==4.8.1.78
numpy==1.24.3
scipy==1.11.4
pillow==10.1.0
gunicorn==21.2.0
```

2. Update `app_backend.py` to use Gunicorn for production:

```python
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
```

3. Create `Procfile` in project root:

```
web: gunicorn app_backend:app
```

#### Step 2: Push to GitHub

```powershell
cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean"

git add .
git commit -m "Add deployment files"
git push origin main
```

#### Step 3: Deploy to Railway

1. Go to [https://railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway to access your GitHub
5. Select your `agroscan` repository
6. Railway auto-detects the Python project
7. Add environment variables (if needed):
   - No special env vars needed for basic setup

8. Click **Deploy**

Your backend URL will look like: `https://your-app-name.up.railway.app`

---

### Option 2: Deploy to Heroku (Free tier no longer available, but here's the process)

Use the same `requirements.txt` and `Procfile` approach above, then:

```powershell
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

---

### Option 3: Deploy to Render.com

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app_backend:app`
   - **Environment**: Python 3.10
6. Deploy

---

## Part 3: Connect Frontend to Backend

After backend is deployed:

1. Get your backend URL (e.g., `https://agroscan-backend.up.railway.app`)

2. Update Netlify environment variable:
   - Go to Netlify Dashboard → **Site Settings** → **Build & deploy** → **Environment**
   - Update `VITE_API_URL` = `https://agroscan-backend.up.railway.app`

3. Trigger a redeploy:
   - Make a small commit and push to GitHub
   - Or manually redeploy in Netlify

---

## Important: Model & Features Files

**Critical Issue**: The trained model files (`vgg16_model.keras`, `features.npy`, `labels.npy`) are large files and **cannot be stored in GitHub** due to size limits.

### Solution: Use Git LFS or Cloud Storage

#### Option A: Git LFS (Large File Storage)

1. Install Git LFS:
   ```powershell
   git lfs install
   ```

2. Track large files:
   ```powershell
   git lfs track "trained_models/*.keras"
   git lfs track "features/*.npy"
   git add .gitattributes
   git commit -m "Enable Git LFS"
   git push
   ```

3. Push to GitHub:
   ```powershell
   git push origin main
   ```

Note: Free tier has limited storage. Paid plans available.

#### Option B: AWS S3 or Cloud Storage

1. Upload model files to AWS S3
2. Modify backend to download from S3 on startup:

```python
import boto3

def download_models_from_s3():
    s3 = boto3.client('s3')
    s3.download_file('your-bucket', 'vgg16_model.keras', '/app/trained_models/vgg16_model.keras')
    s3.download_file('your-bucket', 'features.npy', '/app/features/features.npy')
    s3.download_file('your-bucket', 'labels.npy', '/app/features/labels.npy')

if __name__ == "__main__":
    download_models_from_s3()
    # rest of app
```

---

## Step-by-Step Deployment Checklist

- [ ] Build React app: `npm run build`
- [ ] Create GitHub repository
- [ ] Push code to GitHub (including `requirements.txt` and `Procfile`)
- [ ] Create Netlify account and connect GitHub
- [ ] Set up Netlify build settings (build command: `npm run build`, publish: `dist`)
- [ ] Create backend hosting account (Railway/Render/AWS)
- [ ] Deploy backend
- [ ] Get backend URL
- [ ] Update Netlify environment variable with backend URL
- [ ] Test API calls from frontend
- [ ] Set up custom domain (optional)

---

## Full URLs After Deployment

Once deployed:

**Frontend**: `https://your-agroscan-site.netlify.app`
**Backend API**: `https://your-agroscan-backend.up.railway.app/analyze`

Example test:
```bash
curl -X POST "https://your-agroscan-backend.up.railway.app/analyze" \
  -F "image=@wheat_leaf.jpg" \
  -F "image_id=test_1"
```

---

## Enable CORS on Backend

Make sure your Flask backend has CORS enabled for Netlify domain:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/analyze": {
        "origins": [
            "https://your-agroscan-site.netlify.app",
            "http://localhost:8080"  # Keep for local development
        ]
    }
})
```

---

## Optional: Custom Domain

1. In Netlify: **Site Settings** → **Domain Management** → **Add domain**
2. Update your domain DNS settings to point to Netlify
3. Enable HTTPS (automatic with Let's Encrypt)

---

## Monitoring & Logs

**Netlify Logs**:
- Go to **Deploys** → Click on a deploy → **Deploy log**

**Railway/Backend Logs**:
- Dashboard shows real-time logs
- Check for errors in model loading or API calls

---

## Performance Tips

1. **Optimize frontend bundle**: `npm run build` creates optimized files
2. **Cache model files**: Consider caching to reduce load time
3. **Add CDN**: Netlify includes CDN automatically
4. **Monitor API response times**: Use browser DevTools Network tab

---

## Cost Estimates

| Service | Free Tier | Paid Starting |
|---|---|---|
| Netlify | 100GB/month | $19/month |
| Railway | $5 credit/month | Pay-as-you-go |
| Render | Limited free | $7/month |
| GitHub | Unlimited | $4-21/month |

---

## Troubleshooting Deployment

### Issue: Frontend can't reach backend
- **Check**: Backend URL in environment variable is correct
- **Check**: CORS is enabled on backend
- **Check**: Backend is actually running

### Issue: Models not found on backend
- **Solution**: Use Git LFS or cloud storage (see above)
- **Check**: File paths are correct in deployed environment

### Issue: Slow API response
- **Cause**: TensorFlow loading on first request
- **Solution**: Pre-load models on server startup

### Issue: Out of memory
- **Cause**: Model file too large
- **Solution**: Use smaller model or upgrade server tier

---

## Next Steps

1. **Follow Part 1** (Netlify frontend deployment)
2. **Choose backend option** (Railway recommended)
3. **Follow Part 2** for your chosen backend service
4. **Connect them** in Part 3
5. **Test end-to-end** from browser

Good luck with your deployment! 🚀

---

**Need Help?**
- Netlify Support: https://docs.netlify.com/
- Railway Docs: https://docs.railway.app/
- Flask Deployment: https://flask.palletsprojects.com/deployment/
