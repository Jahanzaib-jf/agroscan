@echo off
echo --------------------------------------------
echo Launching AgroScan - Wheat Guardian
echo --------------------------------------------

REM === Set Conda path ===
SET "CONDA_PATH=C:\Users\HP\anaconda3\Scripts"
CALL "%CONDA_PATH%\activate.bat" base

REM Step 1: Start Flask backend in new window
cd /d "C:\Users\HP\Downloads\siamese_final_clean\agroscan-wheat-guardian-main\agroscan-wheat-guardian-main"
start "Flask Backend" cmd /k "%CONDA_PATH%\activate.bat base && python app_backend.py"

REM Wait for backend to start
timeout /t 8 > nul

REM Step 2: Start React frontend in new window
start "React Frontend" cmd /k "npm run dev"

exit
