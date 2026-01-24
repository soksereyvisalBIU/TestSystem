@echo off
setlocal enabledelayedexpansion

:: Performance: Change drive and directory simultaneously
:: Update the path below to your specific D: drive folder
cd /d "D:\website\testsystem"

:: Security: Verify we are in a git repo before executing
if not exist ".git" (
    echo [ERROR] Not a git repository.
    exit /b 1
)

:: Speed: Optimize Git for Windows NTFS
git config --local core.fscache true

:: Execution: Fetch and Pull with minimal I/O overhead
:: --prune: Removes stale remote refs
:: --ff-only: Prevents task hanging on merge conflicts
git fetch --prune --quiet && git pull --ff-only --quiet

exit /b 0



@echo off
:: Setup paths
set "LOG_FILE=D:\Scripts\git_sync_log.txt"
set "REPO_DIR=D:\website\testsystem"

:: Performance: Use drive-specific jump
cd /d "%REPO_DIR%"

:: Timestamping for the log
echo ------------------------------------------ >> "%LOG_FILE%"
echo Date: %date% Time: %time% >> "%LOG_FILE%"
echo Directory: %CD% >> "%LOG_FILE%"

:: Performance & Security flags:
:: --quiet: Reduces I/O latency
:: --ff-only: Ensures we don't hang on merge conflicts
echo Running Git Fetch... >> "%LOG_FILE%"
git fetch --prune --quiet >> "%LOG_FILE%" 2>&1

echo Running Git Pull... >> "%LOG_FILE%"
git pull --ff-only --quiet >> "%LOG_FILE%" 2>&1

:: Check exit code (0 = success, 1+ = failure)
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Sync complete. >> "%LOG_FILE%"
) else (
    echo [ERROR] Sync failed with Exit Code: %ERRORLEVEL% >> "%LOG_FILE%"
)
exit /b %ERRORLEVEL%