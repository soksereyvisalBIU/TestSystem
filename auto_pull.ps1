# auto_pull.ps1
# Path to your repo
$repoPath = "D:\website\testsystem"
$branch = "main"   # change if your branch is different

# Go to repo folder
Set-Location $repoPath

# Stash local changes safely (ignore errors if nothing to stash)
git stash push -m "Auto-stash before pull" 2>$null

# Pull latest changes from remote
git pull origin $branch

# Apply stashed changes back (if any)
$stashList = git stash list
if ($stashList -match "Auto-stash before pull") {
    git stash pop
}
