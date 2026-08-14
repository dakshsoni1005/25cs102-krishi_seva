# PowerShell script to push folders to their respective Git branches on GitHub

# Ensure we are on main branch locally
Write-Host "Checking current branch..." -ForegroundColor Cyan
$currentBranch = (git branch --show-current)
if ($currentBranch -ne "main") {
    Write-Host "Please commit your changes and checkout the 'main' branch first." -ForegroundColor Yellow
    exit
}

# Check for uncommitted changes on main
$status = (git status --porcelain)
if ($status) {
    Write-Host "You have uncommitted changes on 'main'. Please commit them before pushing." -ForegroundColor Yellow
    exit
}

# 1. Update backend branch
Write-Host "`nUpdating backend branch..." -ForegroundColor Cyan
git checkout backend
git checkout main -- backend
$backendStatus = (git status --porcelain backend)
if ($backendStatus) {
    git add backend
    git commit -m "Sync backend from main"
    Write-Host "Pushing backend to GitHub..." -ForegroundColor Green
    git push origin backend
} else {
    Write-Host "No changes in backend." -ForegroundColor Gray
}

# 2. Update frontend branch
Write-Host "`nUpdating frontend branch..." -ForegroundColor Cyan
git checkout frontend
git checkout main -- frontend
$frontendStatus = (git status --porcelain frontend)
if ($frontendStatus) {
    git add frontend
    git commit -m "Sync frontend from main"
    Write-Host "Pushing frontend to GitHub..." -ForegroundColor Green
    git push origin frontend
} else {
    Write-Host "No changes in frontend." -ForegroundColor Gray
}

# 3. Update dataset branch
Write-Host "`nUpdating dataset branch..." -ForegroundColor Cyan
git checkout dataset
git checkout main -- dataset.json
$datasetStatus = (git status --porcelain dataset.json)
if ($datasetStatus) {
    git add dataset.json
    git commit -m "Sync dataset from main"
    Write-Host "Pushing dataset to GitHub..." -ForegroundColor Green
    git push origin dataset
} else {
    Write-Host "No changes in dataset." -ForegroundColor Gray
}

# Switch back to main branch
Write-Host "`nSwitching back to main branch..." -ForegroundColor Cyan
git checkout main

Write-Host "`nAll done! All branches are synced and you are back on the 'main' branch." -ForegroundColor Green
