@echo off
REM ============================================================
REM  Solar System - double-click this file to run the website.
REM
REM  Starts a small static server (Python standard library only)
REM  and opens the site in your default browser.
REM
REM  Use this rather than opening index.html directly: over
REM  file:// the cross-document view transitions and some asset
REM  loads do not behave the way they will once deployed.
REM ============================================================

cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Python was not found on your PATH.
  echo.
  echo   Install it from https://www.python.org/downloads/ and make sure
  echo   "Add python.exe to PATH" is ticked during setup, then
  echo   double-click this file again.
  echo.
  pause
  exit /b 1
)

python "scripts\serve.py"

REM Only hold the window open if something actually went wrong.
if errorlevel 1 pause
