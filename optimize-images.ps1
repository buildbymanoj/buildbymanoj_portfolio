# Image Optimization Script
# Run this to optimize your images for web performance

Write-Host "🖼️  Portfolio Image Optimizer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if sharp-cli is installed
Write-Host "Checking for sharp-cli..." -ForegroundColor Yellow
$sharpInstalled = Get-Command sharp -ErrorAction SilentlyContinue

if (-not $sharpInstalled) {
    Write-Host "❌ sharp-cli not found. Installing..." -ForegroundColor Red
    npm install -g sharp-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install sharp-cli. Please run: npm install -g sharp-cli" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ sharp-cli installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ sharp-cli already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting image optimization..." -ForegroundColor Cyan
Write-Host ""

# Create backup directory
$backupDir = "assets/backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "📁 Created backup directory: $backupDir" -ForegroundColor Yellow
}

# Backup original images
Write-Host "📦 Backing up original images..." -ForegroundColor Yellow
Copy-Item "assets/applogo.png" -Destination $backupDir -ErrorAction SilentlyContinue
Copy-Item "assets/MANOJ.jpg" -Destination $backupDir -ErrorAction SilentlyContinue
Write-Host "✅ Backup complete!" -ForegroundColor Green
Write-Host ""

# Optimize applogo.png
Write-Host "🔧 Optimizing applogo.png (615KB → ~150KB)..." -ForegroundColor Yellow
$originalSize = (Get-Item "assets/applogo.png").Length / 1KB
Write-Host "   Original size: $([math]::Round($originalSize, 2)) KB"

# Create WebP version
sharp assets/applogo.png --resize 400 --webp --quality 85 --output assets/applogo.webp 2>&1 | Out-Null

if (Test-Path "assets/applogo.webp") {
    $newSize = (Get-Item "assets/applogo.webp").Length / 1KB
    $savings = $originalSize - $newSize
    $savingsPercent = ($savings / $originalSize) * 100
    Write-Host "   New size: $([math]::Round($newSize, 2)) KB" -ForegroundColor Green
    Write-Host "   Saved: $([math]::Round($savings, 2)) KB ($([math]::Round($savingsPercent, 1))% reduction)" -ForegroundColor Green
    Write-Host "   ✅ Created: assets/applogo.webp" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to create WebP version" -ForegroundColor Red
}

Write-Host ""

# Optimize MANOJ.jpg
Write-Host "🔧 Optimizing MANOJ.jpg (118KB → ~40KB)..." -ForegroundColor Yellow
$originalSize = (Get-Item "assets/MANOJ.jpg").Length / 1KB
Write-Host "   Original size: $([math]::Round($originalSize, 2)) KB"

# Create WebP version
sharp assets/MANOJ.jpg --resize 800 --webp --quality 80 --output assets/MANOJ.webp 2>&1 | Out-Null

if (Test-Path "assets/MANOJ.webp") {
    $newSize = (Get-Item "assets/MANOJ.webp").Length / 1KB
    $savings = $originalSize - $newSize
    $savingsPercent = ($savings / $originalSize) * 100
    Write-Host "   New size: $([math]::Round($newSize, 2)) KB" -ForegroundColor Green
    Write-Host "   Saved: $([math]::Round($savings, 2)) KB ($([math]::Round($savingsPercent, 1))% reduction)" -ForegroundColor Green
    Write-Host "   ✅ Created: assets/MANOJ.webp" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to create WebP version" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Optimization Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update HTML to use WebP images with fallbacks"
Write-Host "2. Test locally: Open index.html in browser"
Write-Host "3. Deploy to Vercel"
Write-Host "4. Test with Lighthouse: lighthouse https://buildbymanoj-portfolio.vercel.app"
Write-Host ""
Write-Host "Original images backed up to: $backupDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "HTML Update Example:" -ForegroundColor Yellow
Write-Host '  <picture>'
Write-Host '    <source srcset="assets/applogo.webp" type="image/webp">'
Write-Host '    <img src="assets/applogo.png" alt="Logo">'
Write-Host '  </picture>'
Write-Host ""
