# auto_pull.ps1
$repoPath = "D:\website\testsystem"   # your repo path
$branch = "main"                       # your branch
$logFile = "D:\Scripts\git_auto_pull.log"   # log file path
$git = "C:\Program Files\Git\bin\git.exe"   # full path to git.exe

# Go to repo folder
Set-Location $repoPath

# Add timestamp to log
Add-Content $logFile "`n===== $(Get-Date) ====="

# Stash local changes safely (ignore errors if nothing to stash)
Add-Content $logFile "Stashing local changes..."
& $git stash push -m "Auto-stash before pull" 2>>$logFile

# Pull latest changes
Add-Content $logFile "Pulling latest changes..."
$pullResult = & $git pull origin $branch 2>&1
Add-Content $logFile $pullResult

# Apply stashed changes back
$stashList = & $git stash list
if ($stashList -match "Auto-stash before pull") {
    Add-Content $logFile "Applying stashed changes..."
    & $git stash pop >>$logFile 2>&1
}

Add-Content $logFile "Task finished.`n"
