<#
Start-local.ps1
Automatiza: docker compose build/up -> aguarda DB healthy -> executa seed -> aguarda app -> imprime link e credenciais
Uso: abra PowerShell como administrador (ou user), navegue para a raiz do projeto e rode:
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
#>

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# raiz do projeto (uma pasta acima de scripts)
$projectDir = Join-Path $scriptDir ".."
Set-Location $projectDir

Write-Host "Verificando Docker..."
try {
  docker version > $null
} catch {
  Write-Error "Docker não parece estar rodando. Abra o Docker Desktop e tente novamente. Saindo."
  exit 1
}

Write-Host "(Re)construindo e iniciando containers via docker compose..."
docker compose build --no-cache
docker compose up -d

Write-Host "Aguardando serviço de banco (postgres) ficar saudável..."
$dbContainer = docker compose ps -q db
if (-not $dbContainer) {
  Write-Warning "Container 'db' não encontrado. Verifique docker compose logs.";
} else {
  $attempts = 0
  $maxAttempts = 60
  while ($attempts -lt $maxAttempts) {
    try {
      $health = docker inspect --format='{{json .State.Health.Status}}' $dbContainer 2>$null
    } catch {
      $health = $null
    }
    if ($health -and $health -eq '"healthy"') { break }
    Start-Sleep -Seconds 2
    $attempts++
    Write-Host -NoNewline "."
  }
  Write-Host "`nDB health check attempts: $attempts"
  if ($attempts -ge $maxAttempts) { Write-Warning "DB não ficou saudável no tempo esperado." }
}

Write-Host "Executando seed (idempotente)..."
$env:DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/seguradora'
try {
  # garantir que estamos na raiz do projeto
  Set-Location $projectDir
  npx ts-node --transpile-only prisma/seed.ts
} catch {
  Write-Warning "Falha ao executar seed: $($_.Exception.Message)";
}

Write-Host "Aguardando aplicação responder em http://127.0.0.1:3000 ..."
$ready = $false
$attempts = 0
while (-not $ready -and $attempts -lt 60) {
  try {
    $resp = Invoke-WebRequest -Uri 'http://127.0.0.1:3000' -UseBasicParsing -TimeoutSec 5
    if ($resp.StatusCode -ge 200) { $ready = $true; break }
  } catch {
    Start-Sleep -Seconds 2
    $attempts++
    Write-Host -NoNewline "."
  }
}
Write-Host "`nTentativas: $attempts"
if (-not $ready) {
  Write-Warning "Aplicação não respondeu após timeout. Verifique logs do container 'app': docker compose logs app --tail 200"
  exit 1
}

Write-Host "Aplicação disponível: http://127.0.0.1:3000"
Write-Host "Rota de login (NextAuth): http://127.0.0.1:3000/api/auth/signin"
Write-Host "Credenciais seed: admin@seguradora.test / Admin@123  (consultor1@seguradora.test / Consultor1@123)"
Write-Host "Você pode rodar os smoke-tests: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1"
