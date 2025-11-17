import streamlit as st
import os
import json
import hashlib
import cv2
import numpy as np
import tensorflow as tf
from scipy.spatial.distance import euclidean
import matplotlib.pyplot as plt
from PIL import Image

# -------------------------------------------------------
# 🔒 USER HANDLING
# -------------------------------------------------------
USER_FILE = "users.json"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f)

def register_user(username, password):
    users = load_users()
    if username in users:
        return False
    users[username] = hash_password(password)
    save_users(users)
    return True

def authenticate_user(username, password):
    users = load_users()
    return username in users and users[username] == hash_password(password)

# -------------------------------------------------------
# 📂 MODEL AND DATA PATHS
# -------------------------------------------------------
# Resolve paths relative to this file so the app works regardless of where it's launched from
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "trained_models")
FEATURES_PATH = os.path.join(BASE_DIR, "features", "features.npy")
LABELS_PATH = os.path.join(BASE_DIR, "features", "labels.npy")

vgg16_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "vgg16_model.keras"))
features = np.load(FEATURES_PATH)
labels = np.load(LABELS_PATH)
class_labels = ["Immune", "R", "RMR", "MR", "MRMS", "MS", "MSS", "S"]

# -------------------------------------------------------
# 🔍 ANALYSIS FUNCTIONS
# -------------------------------------------------------
def extract_features(image):
    image = cv2.resize(image, (224, 224)) / 255.0
    image = np.expand_dims(image, axis=0)
    return vgg16_model.predict(image).flatten()

def classify_leaf(image):
    test_feat = extract_features(image)
    distances = [euclidean(test_feat, ref) for ref in features]
    predicted_index = np.argmin(distances)
    return class_labels[int(labels[predicted_index])]

def calculate_infected_area(original_image):
    hsv = cv2.cvtColor(original_image, cv2.COLOR_RGB2HSV)

    lower_leaf = np.array([20, 40, 40])
    upper_leaf = np.array([100, 255, 255])
    leaf_mask = cv2.inRange(hsv, lower_leaf, upper_leaf)

    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    lower_infected = np.array([10, 50, 50])
    upper_infected = np.array([35, 255, 255])
    infected_mask = cv2.inRange(hsv, lower_infected, upper_infected)

    healthy_area = np.count_nonzero(cv2.bitwise_and(green_mask, leaf_mask))
    infected_area = np.count_nonzero(cv2.bitwise_and(infected_mask, leaf_mask))
    total_leaf_area = np.count_nonzero(leaf_mask)

    if total_leaf_area == 0:
        return 0, green_mask, original_image

    percent_infected = round((infected_area / total_leaf_area) * 100)

    blurred = cv2.GaussianBlur(original_image, (25, 25), 0)
    mask_3d = np.repeat(infected_mask[:, :, np.newaxis], 3, axis=2)
    highlighted = np.where(mask_3d > 0, original_image, blurred)

    return percent_infected, green_mask, highlighted

# -------------------------------------------------------
# 🔐 LOGIN PAGE
# -------------------------------------------------------
def login_register():
    st.title("Login or Register")
    action = st.radio("Select Action", ["Login", "Register"])
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if action == "Register":
        if st.button("Register"):
            if register_user(username, password):
                st.success("Registration successful! You can now log in.")
            else:
                st.error("Username already exists.")

    elif action == "Login":
        if st.button("Login"):
            if authenticate_user(username, password):
                st.success("Login successful.")
                st.session_state.logged_in = True
                st.session_state.username = username
            else:
                st.error("Invalid credentials.")

# -------------------------------------------------------
# 📌 ABOUT PAGE
# -------------------------------------------------------
def about_page():
    st.title("About the Project")
    st.markdown("""
        This AI-based system detects and classifies the severity of wheat rust disease using deep learning. It uses a Siamese Network with VGG16 for feature extraction and HSV-based image segmentation to calculate the infected area.
    """)
    if st.button("Go to Analysis Tool"):
        st.session_state.page = "analysis"

# -------------------------------------------------------
# 🧠 ANALYSIS TOOL PAGE
# -------------------------------------------------------
def analysis_page():
    st.title("Leaf Rust Analysis Tool")
    image_id = st.text_input("Enter Image ID")
    uploaded_file = st.file_uploader("Upload Leaf Image", type=["jpg", "jpeg", "png"])

    if uploaded_file and image_id.strip():
        file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
        img_bgr = cv2.imdecode(file_bytes, 1)
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        predicted_class = classify_leaf(img_rgb)
        infected_percentage, green_mask, highlighted_img = calculate_infected_area(img_rgb)
        result = f"{infected_percentage}{predicted_class}"

        st.success("Analysis Completed!")
        st.markdown(f"**Final Results:**\n- **Result**: {result}\n- **Predicted Class**: {predicted_class}\n- **Infected Area**: {infected_percentage}%")

        col1, col2, col3 = st.columns(3)
        col1.image(img_rgb, caption="Original Image", use_column_width=True)
        col2.image(green_mask, caption="Green Mask (White = Healthy)", use_column_width=True, clamp=True)
        col3.image(highlighted_img, caption="Highlighted Infected Area", use_column_width=True)

# -------------------------------------------------------
# 🚀 MAIN
# -------------------------------------------------------
def main():
    st.set_page_config(page_title="Wheat Rust Analyzer", layout="wide")

    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False
    if "page" not in st.session_state:
        st.session_state.page = "about"

    if not st.session_state.logged_in:
        login_register()
    elif st.session_state.page == "about":
        about_page()
    elif st.session_state.page == "analysis":
        analysis_page()

if __name__ == "__main__":
    main()
