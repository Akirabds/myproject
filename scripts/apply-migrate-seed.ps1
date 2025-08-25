Param(
  [string]$MigrationName = "add-numero-contrato",
  [string]$DatabaseUrl = $env:DATABASE_URL
)

Write-Host "=== Apply migration / seed / rebuild script ==="

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

# 1) Push schema directly to the database (no migration history)
# Use this for local development to sync the Prisma schema immediately.
RunCmd "npx prisma db push"

# 2) Regenerate Prisma client
RunCmd "npx prisma generate"

# 3) Run seed (idempotente)
RunCmd "npx ts-node --transpile-only prisma/seed.ts"

# 4) Rebuild and restart Docker services
RunCmd "docker compose build --no-cache"
RunCmd "docker compose up -d"

# 5) Wait for app on port 3000
Write-Host "\nWaiting for app to respond on http://127.0.0.1:3000 ..."
$maxAttempts = 30
for ($i = 0; $i -lt $maxAttempts; $i++) {
  $res = Test-NetConnection -ComputerName 127.0.0.1 -Port 3000
  if ($res.TcpTestSucceeded) { Write-Host "Port 3000 open"; break }
  Start-Sleep -Seconds 2
}

# 6) Quick health check
try {
  $root = Invoke-RestMethod -Uri http://127.0.0.1:3000/ -UseBasicParsing -ErrorAction Stop
  Write-Host "Root responded (HTTP)."
} catch {
  Write-Host "Root returned non-200 (this may be normal for Next.js root)."
}

try {
  $api = Invoke-RestMethod -Uri http://127.0.0.1:3000/api/admin/consultores -UseBasicParsing -ErrorAction Stop
  Write-Host "API /api/admin/consultores returned:"; $api | ConvertTo-Json -Depth 4
} catch {
  Write-Host "API /api/admin/consultores request returned non-200 (likely requires auth). Response: " $_.Exception.Response.StatusCode
}

Write-Host "\nScript finished. If everything passed, the migration was applied, Prisma client was regenerated, seed ran and Docker containers were restarted."
