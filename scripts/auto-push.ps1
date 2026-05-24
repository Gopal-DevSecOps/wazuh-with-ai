param(
    [string]$WatchPath = (Get-Location).Path,
    [int]$DebounceMs = 5000,
    [string]$Branch = "main"
)

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WatchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$global:lastEvent = Get-Date
$global:timer = $null

$action = {
    $now = Get-Date
    if (($now - $global:lastEvent).TotalMilliseconds -gt $DebounceMs) {
        $global:lastEvent = $now
        Write-Host "`n[Change detected] Auto-committing..." -ForegroundColor Cyan

        Set-Location -LiteralPath $WatchPath
        git add -A
        $commitMsg = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $commitMsg

        # Backup copy
        $backupDir = Join-Path $WatchPath "backups"
        $backupFile = Join-Path $backupDir "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
        if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }

        try {
            git push origin $Branch 2>&1 | Out-Null
            Write-Host "[Pushed to GitHub] $commitMsg" -ForegroundColor Green
        } catch {
            Write-Host "[Push failed] Remote not set. Run: git remote add origin <repo-url>" -ForegroundColor Yellow
        }
    }
    $global:lastEvent = $now
}

Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

Write-Host "`n=== Auto-Push Watcher Started ===" -ForegroundColor Green
Write-Host "Watching: $WatchPath" -ForegroundColor Green
Write-Host "Debounce: ${DebounceMs}ms" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow

while ($true) {
    Start-Sleep -Seconds 1
}
