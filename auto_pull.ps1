# auto_pull.ps1
$repoPath = "D:\website\testsystem"
$branch = "main"
$logFile = "D:\Scripts\git_auto_pull.log"

Set-Location $repoPath

# Add timestamp to log
Add-Content $logFile "`n===== $(Get-Date) ====="

# Stash local changes safely
git stash push -m "Auto-stash before pull" 2>>$logFile

# Pull latest changes
git pull origin $branch >>$logFile 2>&1

# Apply stashed changes back
$stashList = git stash list
if ($stashList -match "Auto-stash before pull") {
    git stash pop >>$logFile 2>&1
}
