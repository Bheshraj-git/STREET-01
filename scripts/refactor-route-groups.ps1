# Route group refactor for STREET/01
# Moves storefront, admin, and account pages into their own layout groups.

$ErrorActionPreference = "Stop"

Write-Host "`n=== Route group refactor ===" -ForegroundColor Cyan

# 1. Create the new route group folders
New-Item -ItemType Directory -Force -Path "src\app\(store)" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(admin)" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(account)" | Out-Null

# 2. Move admin into (admin)/admin
if (Test-Path "src\app\admin") {
  Move-Item -LiteralPath "src\app\admin" -Destination "src\app\(admin)\admin"
  Write-Host "Moved admin → (admin)/admin" -ForegroundColor Green
}

# 3. Move account into (account)/account
if (Test-Path "src\app\account") {
  Move-Item -LiteralPath "src\app\account" -Destination "src\app\(account)\account"
  Write-Host "Moved account → (account)/account" -ForegroundColor Green
}

# 4. Move storefront pages into (store)/
$storeFolders = @("shop", "products", "cart", "checkout", "orders", "about", "collections", "login", "register")

foreach ($folder in $storeFolders) {
  $src = "src\app\$folder"
  if (Test-Path $src) {
    Move-Item -LiteralPath $src -Destination "src\app\(store)\$folder"
    Write-Host "Moved $folder → (store)/$folder" -ForegroundColor Green
  }
}

# 5. Move storefront page.tsx (homepage)
if (Test-Path "src\app\page.tsx") {
  Move-Item -LiteralPath "src\app\page.tsx" -Destination "src\app\(store)\page.tsx"
  Write-Host "Moved homepage → (store)/page.tsx" -ForegroundColor Green
}

# 6. Create new layout.tsx files for each group
# (these are placeholders — you'll paste the real content from the next steps)
New-Item -ItemType File -Force -Path "src\app\(store)\layout.tsx" | Out-Null
New-Item -ItemType File -Force -Path "src\app\(admin)\layout.tsx" | Out-Null
New-Item -ItemType File -Force -Path "src\app\(account)\layout.tsx" | Out-Null

Write-Host "`nDone. Now paste the layout.tsx content for each group." -ForegroundColor Yellow
Write-Host "Current structure:"
Get-ChildItem src\app -Recurse -Depth 1 | Select-Object FullName