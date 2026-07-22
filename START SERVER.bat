@echo off
echo Starting Renewity Residential Care Home website server...
echo Open your browser to: http://localhost:3050/
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
node serve.mjs
pause
