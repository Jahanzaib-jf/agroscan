import os
import base64
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.spatial.distance import euclidean
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load model and features
# Resolve project root relative to this file so paths work regardless of CWD
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_DIR = os.path.join(BASE_DIR, "trained_models")
FEATURES_DIR = os.path.join(BASE_DIR, "features")

print(f"[DEBUG] BASE_DIR: {BASE_DIR}")
print(f"[DEBUG] MODEL_DIR: {MODEL_DIR}")
print(f"[DEBUG] FEATURES_DIR: {FEATURES_DIR}")

# Load models and feature arrays
try:
    vgg_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "vgg16_model.keras"))
    print(f"[DEBUG] ✅ VGG16 model loaded successfully")
except Exception as e:
    print(f"[ERROR] Failed to load VGG16 model: {e}")
    raise

# If you want to switch to siamese model, use 'siamese_model.keras' instead
try:
    features = np.load(os.path.join(FEATURES_DIR, "features.npy"))
    labels = np.load(os.path.join(FEATURES_DIR, "labels.npy"))
    print(f"[DEBUG] ✅ Features and labels loaded successfully")
    print(f"[DEBUG] Features shape: {features.shape}, Labels shape: {labels.shape}")
except Exception as e:
    print(f"[ERROR] Failed to load features/labels: {e}")
    raise

#vgg_model = tf.keras.models.load_model("C:/Users/User/Desktop/Pseudo_Desktop/siamese_final_clean/trained_models/vgg16_model.keras")
#"C:\Users\User\Desktop\Pseudo_Desktop\siamese_final_clean\trained_models\siamese_model.keras"
#features = np.load("C:/Users/User/Desktop/Pseudo_Desktop/siamese_final_clean/features/features.npy")
#labels = np.load("C:/Users/User/Desktop/Pseudo_Desktop/siamese_final_clean/features/labels.npy")
class_labels = ["Immune", "R", "RMR", "MR", "MRMS", "MS", "MSS", "S"]

def extract_features(image_array):
    img_resized = cv2.resize(image_array, (224, 224)) / 255.0
    img_input = np.expand_dims(img_resized, axis=0)
    feature_vector = vgg_model.predict(img_input)
    return feature_vector.flatten()

def calculate_masks(image_array):
    hsv = cv2.cvtColor(image_array, cv2.COLOR_RGB2HSV)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    hsv[:, :, 2] = clahe.apply(hsv[:, :, 2])

    lower_leaf = np.array([20, 20, 20])
    upper_leaf = np.array([100, 255, 255])
    leaf_mask = cv2.inRange(hsv, lower_leaf, upper_leaf)

    lower_yellow = np.array([15, 40, 70])
    upper_yellow = np.array([35, 255, 255])
    lower_brown = np.array([10, 25, 40])
    upper_brown = np.array([30, 180, 160])
    rust_mask1 = cv2.inRange(hsv, lower_yellow, upper_yellow)
    rust_mask2 = cv2.inRange(hsv, lower_brown, upper_brown)
    infected_mask = cv2.bitwise_or(rust_mask1, rust_mask2)
    infected_mask = cv2.bitwise_and(infected_mask, leaf_mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    infected_mask = cv2.morphologyEx(infected_mask, cv2.MORPH_OPEN, kernel)

    infected_pixels = int(np.count_nonzero(infected_mask))
    total_leaf_pixels = int(np.count_nonzero(leaf_mask))
    green_pixels = total_leaf_pixels - infected_pixels
    infected_percentage = (infected_pixels / total_leaf_pixels) * 100 if total_leaf_pixels else 0
    infected_percentage = min(round(infected_percentage), 100)

    grey_background = np.full_like(leaf_mask, 127)
    mask_vis = np.where(leaf_mask == 0, grey_background, 255)
    mask_vis[infected_mask > 0] = 0

    blurred = cv2.GaussianBlur(image_array, (25, 25), 0)
    mask_3d = np.repeat(infected_mask[:, :, np.newaxis], 3, axis=2)
    infected_highlight = np.where(mask_3d == 255, image_array, blurred)

    return mask_vis, infected_highlight, infected_percentage, infected_pixels, green_pixels

def encode_image(img_array, mode='RGB'):
    pil_img = Image.fromarray(img_array, mode=mode)
    buffer = BytesIO()
    pil_img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

# ✅ NEW FUNCTION TO DETECT NON-WHEAT IMAGES
def is_likely_wheat_image(image_rgb):
    hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    lower_leaf = np.array([20, 20, 20])
    upper_leaf = np.array([100, 255, 255])
    leaf_mask = cv2.inRange(hsv, lower_leaf, upper_leaf)
    leaf_pixel_count = np.count_nonzero(leaf_mask)
    total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
    leaf_percentage = leaf_pixel_count / total_pixels
    print(f"[DEBUG] Leaf detection: {leaf_percentage*100:.1f}% of image looks like leaf")
    return leaf_percentage > 0.05  # 5% must look like wheat leaf (relaxed threshold)

@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        print("ERROR: No 'image' in request.files")
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]
    if file.filename == "":
        print("ERROR: Empty filename")
        return jsonify({"error": "No selected file"}), 400
    if not allowed_file(file.filename):
        print(f"ERROR: Invalid file extension: {file.filename}")
        return jsonify({"error": "Invalid Image."}), 400

    image_id = request.form.get("image_id", "unknown")
    np_img = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    if image is None:
        print(f"ERROR: Could not decode image {file.filename}")
        return jsonify({"error": "Invalid image data."}), 400

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # ✅ PRE-FILTER for non-wheat images
    if not is_likely_wheat_image(image_rgb):
        print(f"ERROR: Image does not look like wheat leaf: {file.filename}")
        return jsonify({"error": "Invalid input: please upload a wheat crop image."}), 400

    print(f"✅ Image {file.filename} passed validation, extracting features...")

    test_feat = extract_features(image_rgb)
    distances = [euclidean(test_feat, f) for f in features]
    closest_index = np.argmin(distances)
    predicted_class = class_labels[labels[closest_index]]

    green_mask, infected_highlight, infected_percent, infected_pixels, green_pixels = calculate_masks(image_rgb)
    result_str = f"{infected_percent}{predicted_class}"

    return jsonify({
        "predicted_class": predicted_class,
        "infected_percentage": infected_percent,
        "infected_pixels": infected_pixels,
        "green_pixels": green_pixels,
        "result": result_str,
        "green_mask": encode_image(green_mask, mode='L'),
        "infected_highlight": encode_image(infected_highlight, mode='RGB'),
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)