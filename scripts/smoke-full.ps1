Param(
  [string]$DatabaseUrl = $env:DATABASE_URL
)

Write-Host "=== smoke-full: apply schema/seed/rebuild then smoke-test ==="

if (-not $DatabaseUrl) {
  $DatabaseUrl = 'postgres://postgres:postgres@127.0.0.1:5432/seguradora'
  Write-Host "DATABASE_URL not set. Using default: $DatabaseUrl"
} else {
  Write-Host "Using DATABASE_URL from environment"
}

$env:DATABASE_URL = $DatabaseUrl

function RunCmd([string]$cmd) {
  Write-Host "`n> $cmd"
  & cmd /c $cmd
  if ($LASTEXITCODE -ne 0) {
    Write-Error ("Command failed with exit code {0}: {1}" -f $LASTEXITCODE, $cmd)
    exit $LASTEXITCODE
  }
}

# 1) Apply schema/seed/rebuild
RunCmd "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\apply-migrate-seed.ps1"

# 2) Wait a bit for services to stabilize
Write-Host "Waiting 3s for services to settle..."
Start-Sleep -Seconds 3

# 3) Run smoke-test (existing script should perform login + dashboard + recalcular)
Write-Host "Running smoke-test..."
RunCmd "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-test.ps1"

Write-Host "\nSmoke-full finished successfully. If smoke-test passed, app and DB are healthy."
