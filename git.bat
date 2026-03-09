@echo off
setlocal ENABLEDELAYEDEXPANSION

REM === CONFIGURATION ===
REM Absolute path to your project root (where .git lives)
set "PROJECT_DIR=D:\Projects\Research Projects\FuzzyImageEnhancer"

REM GitHub remote URL for this repo
set "REMOTE_URL=https://github.com/CosmicMashups/FuzzyPix.git"

REM Use all arguments as the commit message; fall back if empty
set "COMMIT_MSG=%*"
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=chore: automated build and push"

echo.
echo === Changing to project directory ===
cd /d "%PROJECT_DIR%" || goto :error

echo.
echo === Ensuring git remote 'origin' is set ===
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin "%REMOTE_URL%" || goto :error
)

echo.
echo === Installing and building app (if scripts exist) ===
if exist "fuzzy-enhance\package.json" (
    cd /d "%PROJECT_DIR%\fuzzy-enhance" || goto :error

    if exist "package-lock.json" (
        echo Running: npm ci
        call npm ci || goto :error
    ) else (
        echo Running: npm install
        call npm install || goto :error
    )

    REM Try a generic build; if it fails, just continue
    echo Running: npm run build (if defined)
    call npm run build
    cd /d "%PROJECT_DIR%" || goto :error
) else (
    echo No root JS project found at fuzzy-enhance\, skipping npm steps.
)

echo.
echo === Adding and committing changes ===
cd /d "%PROJECT_DIR%" || goto :error
git add -A || goto :error

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo No changes to commit or commit failed. Continuing to push any existing commits...
)

echo.
echo === Detecting current branch ===
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%b"
if "%BRANCH%"=="" (
    echo Failed to determine current branch.
    goto :error
)
echo Current branch: %BRANCH%

echo.
echo === Pushing to GitHub (origin/%BRANCH%) ===
git push -u origin "%BRANCH%" || goto :error

echo.
echo Done. Project built (if possible) and pushed to GitHub.
goto :eof

:error
echo.
echo Script failed with error level %ERRORLEVEL%.
exit /b %ERRORLEVEL%