# GitHub Push Script for EdPsych Connect
# This script helps push the EdPsych Connect codebase to GitHub

# Instructions:
# 1. Create a new repository on GitHub (don't initialize with README, .gitignore, or license)
# 2. Run this script with your GitHub username and repository name
# Example: .\github-push.ps1 -username "your-username" -repository "edpsych-connect"

param (
    [Parameter(Mandatory=$true)]
    [string]$username,
    
    [Parameter(Mandatory=$true)]
    [string]$repository
)

# Display information
Write-Host "EdPsych Connect GitHub Push Script" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "Username: $username" -ForegroundColor Yellow
Write-Host "Repository: $repository" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Cyan

# Confirm with user
$confirmation = Read-Host "Do you want to push to https://github.com/$username/$repository? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit
}

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "Git is installed." -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git and try again." -ForegroundColor Red
    exit
}

# Check if the directory is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "This directory is not a git repository. Please run this script from the EdPsych Connect root directory." -ForegroundColor Red
    exit
}

# Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote add origin "https://github.com/$username/$repository.git"

# Check if remote was added successfully
$remotes = git remote -v
if ($remotes -match "origin") {
    Write-Host "Remote repository added successfully." -ForegroundColor Green
} else {
    Write-Host "Failed to add remote repository. Please check your GitHub username and repository name." -ForegroundColor Red
    exit
}

# Push to GitHub
Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan
git push -u origin master

# Check if push was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Code pushed to GitHub successfully!" -ForegroundColor Green
    Write-Host "Your repository is now available at: https://github.com/$username/$repository" -ForegroundColor Cyan
} else {
    Write-Host "Failed to push code to GitHub. Please check your GitHub credentials and try again." -ForegroundColor Red
}

# Provide next steps
Write-Host "--------------------------------" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://github.com/$username/$repository to view your repository" -ForegroundColor White
Write-Host "2. Set up GitHub Pages for documentation (Settings > Pages)" -ForegroundColor White
Write-Host "3. Connect your repository to Vercel for continuous deployment" -ForegroundColor White
Write-Host "4. Add collaborators to your repository (Settings > Collaborators)" -ForegroundColor White
Write-Host "--------------------------------" -ForegroundColor Cyan