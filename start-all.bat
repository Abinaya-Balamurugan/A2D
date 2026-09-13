@echo off
echo Start CatVTON first in your existing CatVTON folder on port 7860.
echo.
start "VestiAI Flask AI Bridge" cmd /k ""%~dp0start-ai-bridge.bat""
timeout /t 3 /nobreak >nul
start "VestiAI Website" cmd /k ""%~dp0start-website.bat""
echo Website: http://localhost:5000
