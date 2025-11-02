Write-Host "=== Vencord Custom Fork - Установка ===" -ForegroundColor Cyan
Write-Host ""

# Проверка Git
Write-Host "Проверка Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "У вас не установлен GIT - https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "Git установлен ✓" -ForegroundColor Green

# Проверка pnpm
Write-Host "Проверка pnpm..." -ForegroundColor Yellow
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm не найден, устанавливаем..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Ошибка установки pnpm" -ForegroundColor Red
        exit 1
    }
}
Write-Host "pnpm установлен ✓" -ForegroundColor Green

# Установка зависимостей
Write-Host ""
Write-Host "Установка зависимостей..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ошибка установки зависимостей" -ForegroundColor Red
    exit 1
}

# Сборка
Write-Host ""
Write-Host "Сборка Vencord..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ошибка сборки" -ForegroundColor Red
    exit 1
}

# Закрытие Discord
Write-Host ""
Write-Host "Проверка процессов Discord..." -ForegroundColor Yellow
$discordProcesses = Get-Process | Where-Object { $_.Name -match "Discord" }
if ($discordProcesses) {
    Write-Host "Закрытие Discord..." -ForegroundColor Yellow
    $discordProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Discord закрыт ✓" -ForegroundColor Green
}

# Инжект
Write-Host ""
Write-Host "Запуск инжекта..." -ForegroundColor Yellow
pnpm inject

Write-Host ""
Write-Host "Установка завершена!" -ForegroundColor Green
