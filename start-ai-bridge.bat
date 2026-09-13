@echo off
cd /d "%~dp0ai\backend"
call "..\..\vton-env\Scripts\activate.bat"
python app.py
pause
