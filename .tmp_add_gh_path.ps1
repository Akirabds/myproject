$ghPath = 'C:\Program Files\GitHub CLI\gh.exe'
if (Test-Path $ghPath) {
    Write-Host "Found gh at: $ghPath"
    & $ghPath --version
    $userPath = [Environment]::GetEnvironmentVariable('Path','User')
    if (-not $userPath) { $userPath = '' }
    if ($userPath -notlike '*C:\Program Files\GitHub CLI*') {
        Write-Host "Adding 'C:\Program Files\GitHub CLI' to user PATH"
        $newPath = $userPath
        if ($newPath -ne '' -and $newPath[-1] -ne ';') { $newPath += ';' }
        $newPath += 'C:\Program Files\GitHub CLI'
        [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        Write-Host "User PATH updated. You may need to restart your shell."
    } else {
        Write-Host "User PATH already contains GitHub CLI dir"
    }
    # refresh current session PATH
    $env:Path = [Environment]::GetEnvironmentVariable('Path','User') + ';' + [Environment]::GetEnvironmentVariable('Path','Machine')
    Write-Host "Current session gh version (after refresh):"
    & $ghPath --version
} else {
    Write-Host "gh.exe not found at $ghPath"
    exit 1
}
