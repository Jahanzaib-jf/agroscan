
import streamlit as st

# --- Page Configuration ---
st.set_page_config(page_title="AgroScan", layout="wide")

# --- Title ---
st.markdown(
    '<h1 style="text-align: center; color: green;">AgroScan</h1>',
    unsafe_allow_html=True
)

# --- Navigation Menu ---
menu = st.selectbox("Navigate", ["-- Select --", "Our Services", "Contact Us", "About Us"], index=0)

# --- Page Logic ---
if menu == "Our Services":
    st.header("Our Services")
    service_choice = st.selectbox("Choose a Service", ["-- Select --", "Wheat Rust Analysis Tool"])
    
    if service_choice == "Wheat Rust Analysis Tool":
        st.subheader("Wheat Rust Analysis Tool")
        st.write("This tool will help classify wheat rust severity and visualize infected areas.")
        st.info("Note: This is under construction and will be integrated with the backend logic.")

elif menu == "Contact Us":
    st.header("Contact Us")
    st.write("For more information, please reach out to us at:")
    st.write("**E-mail:** ")
    st.write("**Phone:** ")

elif menu == "About Us":
    st.header("About AgroScan")
    st.write("""
        AgroScan is a cutting-edge research tool developed to advance the field of agriculture by integrating technology, 
        artificial intelligence, and plant health diagnostics. Its primary purpose is to assist in the early detection and analysis 
        of crop diseases through a user-friendly web platform, enabling data-driven insights for improved agricultural outcomes.
        
        Designed with researchers in mind, AgroScan aims to support agricultural scientists, agritech professionals, and academic institutions 
        in conducting precise, AI-powered studies to enhance crop health, sustainability, and food security.
    """)

