[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "=== Vencord Custom Fork - Installation ===" -ForegroundColor Cyan
Write-Host ""

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed - https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "Git installed" -ForegroundColor Green

# Check pnpm
Write-Host "Checking pnpm..." -ForegroundColor Yellow
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm not found, installing..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing pnpm" -ForegroundColor Red
        exit 1
    }
}
Write-Host "pnpm installed" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing dependencies" -ForegroundColor Red
    exit 1
}

# Build
Write-Host ""
Write-Host "Building Vencord..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build error" -ForegroundColor Red
    exit 1
}

# Close Discord
Write-Host ""
Write-Host "Checking Discord processes..." -ForegroundColor Yellow
$discordProcesses = Get-Process | Where-Object { $_.Name -match "Discord" }
if ($discordProcesses) {
    Write-Host "Closing Discord..." -ForegroundColor Yellow
    $discordProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Discord closed" -ForegroundColor Green
}

# Inject
Write-Host ""
Write-Host "Running inject..." -ForegroundColor Yellow
pnpm inject

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
