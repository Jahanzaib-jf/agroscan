# AgroScan Wheat Rust Detection - Setup & Run Instructions

## Project Overview
This is a full-stack web application for wheat rust disease detection using AI:
- **Backend**: Flask API (Python) with TensorFlow VGG16 model
- **Frontend**: React app with Vite (TypeScript)
- **ML Model**: Siamese Network + VGG16 for feature extraction and disease classification

---

## Prerequisites
- **Windows OS** (project uses embedded Python for Windows)
- **Node.js** (v18+) - for React frontend
- **Python 3.10+** - optional if using embedded Python

---

## Step-by-Step Setup

### Step 1: Extract/Copy the Project
Copy the entire `siamese_final_clean` folder to your new computer:
```
C:\Users\YourUsername\Downloads\siamese_final_clean\
```

Verify the structure:
- `trained_models/` (contains `vgg16_model.keras`)
- `features/` (contains `features.npy` and `labels.npy`)
- `agroscan-wheat-guardian-main/agroscan-wheat-guardian-main/` (frontend & backend code)
- `app.py`, `app_backend.py` (Python entry points)

---

### Step 2: Fix the Backend Path Resolution (One-time Fix)

The backend loads models using hardcoded absolute paths. I've already fixed this in the files below, but verify they contain relative path resolution:

#### File: `agroscan-wheat-guardian-main/agroscan-wheat-guardian-main/app_backend.py`
Should contain this at the top (after imports):
```python
# Resolve project root relative to this file so paths work regardless of CWD
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_DIR = os.path.join(BASE_DIR, "trained_models")
FEATURES_DIR = os.path.join(BASE_DIR, "features")

# Load models and feature arrays
vgg_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "vgg16_model.keras"))
features = np.load(os.path.join(FEATURES_DIR, "features.npy"))
labels = np.load(os.path.join(FEATURES_DIR, "labels.npy"))
```

#### File: `app.py` (Streamlit app)
Should contain this at the top (before model loading):
```python
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "trained_models")
FEATURES_PATH = os.path.join(BASE_DIR, "features", "features.npy")
LABELS_PATH = os.path.join(BASE_DIR, "features", "labels.npy")
```

---

### Step 3: Install Node.js Dependencies

Open PowerShell and navigate to the frontend folder:
```powershell
cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main"
npm install
```

This installs all React and Vite dependencies (may take 2-5 minutes).

---

### Step 4: Start the Flask Backend

The embedded Python is included in the frontend folder. Run:

```powershell
cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean"

.\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main\python-3.10.4-embed-amd64\python.exe `
  .\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main\app_backend.py
```

**Expected Output:**
```
[DEBUG] BASE_DIR: C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean
[DEBUG] ✅ VGG16 model loaded successfully
[DEBUG] ✅ Features and labels loaded successfully
[DEBUG] Features shape: (2320, 25088), Labels shape: (2320,)
 * Running on http://127.0.0.1:5000
```

Leave this terminal running in the background (or use another terminal for the next step).

---

### Step 5: Start the React Frontend

Open a **new PowerShell terminal**:

```powershell
cd "C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main"
npm run dev
```

**Expected Output:**
```
  VITE v5.4.19  ready in 1627 ms
  ➜  Local:   http://localhost:8080/
```

---

### Step 6: Open the Frontend in Browser

Open your browser and navigate to:
```
http://localhost:8080
```

You should see the AgroScan web app homepage.

---

## How to Use the App

1. Navigate to the **"Services"** or **"Analyze"** page
2. **Enter an Image ID** (e.g., "wheat_leaf_1")
3. **Upload a wheat leaf image** (PNG, JPG, or JPEG format)
4. Click the **"Analyze"** button
5. The app will:
   - Send the image to the Flask backend on port 5000
   - Extract features using VGG16
   - Compare against the feature database (2320 reference images)
   - Return disease class and infection percentage
   - Display original image, green mask, and infection highlights

---

## Troubleshooting

### Issue: "NET::ERR_CONNECTION_REFUSED" on port 5000
- **Solution**: Make sure the Flask backend is running (Step 4)
- Check if both backends are on different terminals
- Verify Flask output shows "Running on http://127.0.0.1:5000"

### Issue: Image rejected - "Invalid input: please upload a wheat crop image"
- **Solution**: The image must have at least 5% leaf-like pixels in HSV color space
- Try a clearer photo of a wheat leaf
- Ensure good lighting in the image

### Issue: "VGG16 model not found"
- **Solution**: Verify the `trained_models/` folder exists at:
  ```
  C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\trained_models\
  ```
- File should be: `vgg16_model.keras`

### Issue: "Features/labels not found"
- **Solution**: Verify the `features/` folder exists at:
  ```
  C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean\features\
  ```
- Files should be: `features.npy` and `labels.npy`

### Issue: npm dependencies fail to install
- **Solution**: Clear npm cache and retry:
  ```powershell
  npm cache clean --force
  npm install
  ```

---

## Alternative: Run Streamlit App (Single App - No Frontend)

If you want to run just the Streamlit app (single Python file with UI):

1. Install Python 3.10+ on your computer (or use embedded Python)
2. Install dependencies:
   ```powershell
   pip install streamlit tensorflow numpy opencv-python scipy pillow matplotlib
   ```
3. Run the app:
   ```powershell
   cd C:\Users\YourUsername\Downloads\siamese_final_clean\siamese_final_clean
   streamlit run app.py
   ```

This opens the Streamlit web interface directly (similar functionality to the React frontend).

---

## Project Files Summary

| File/Folder | Purpose |
|---|---|
| `app_backend.py` | Flask API endpoint for image analysis |
| `app.py` | Streamlit alternative UI |
| `src/pages/Services.tsx` | React frontend - image upload & analysis page |
| `src/pages/Index.tsx` | React frontend - home page |
| `trained_models/vgg16_model.keras` | Pre-trained VGG16 model |
| `features/features.npy` | Reference feature vectors (2320 samples) |
| `features/labels.npy` | Class labels for reference samples |
| `package.json` | Node.js dependencies for React |

---

## Key Changes Made

1. **Fixed path resolution** in `app_backend.py` and `app.py` to use relative paths instead of hardcoded absolute paths
2. **Relaxed leaf detection threshold** from 20% to 5% for better image acceptance
3. **Added debug logging** to help diagnose image validation issues

---

## Support

If you encounter any issues:
1. Check the backend terminal output for error messages
2. Verify all model files exist in `trained_models/` and `features/`
3. Ensure ports 5000 (backend) and 8080 (frontend) are not in use by other applications

---

**Last Updated**: November 16, 2025
