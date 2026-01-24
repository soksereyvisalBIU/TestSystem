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