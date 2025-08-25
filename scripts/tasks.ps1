<#
tasks.ps1 - Atalhos de conveniência para desenvolvimento (PowerShell)
Uso:
  .\scripts\tasks.ps1 <action>
Ações:
  start     - docker compose up -d
  stop      - docker compose down
  build     - docker compose build --no-cache
  restart   - docker compose restart app
  seed      - executa o prisma seed local apontando para o Postgres em docker
  smoke     - executa scripts\smoke-test.ps1
  dev       - npm run dev:local (abre processo em nova janela)
  logs      - docker compose logs --tail 200 --follow
  help      - mostra esta ajuda
#>

param(
  [string]$action
)

function Show-Help {
  Get-Content -Path $PSCommandPath | Select-String -Pattern "Uso:|Ações:" -NotMatch | Out-Null
  Write-Host "Uso: .\scripts\tasks.ps1 <action>`n"
  Write-Host "Ações de conveniência:`n  start, stop, build, restart, seed, smoke, dev, logs, help`n"
}

if (-not $action) {
  Show-Help
  exit 0
}

switch ($action.ToLower()) {
  'start' {
    Write-Host "Subindo serviços (docker compose up -d)..."
    docker compose up -d
    break
  }
  'stop' {
    Write-Host "Derrubando serviços (docker compose down)..."
    docker compose down
    break
  }
  'build' {
    Write-Host "Buildando imagens (docker compose build --no-cache)..."
    docker compose build --no-cache
    break
  }
  'restart' {
    Write-Host "Reiniciando container app..."
    docker compose restart app
    break
  }
  'seed' {
    Write-Host "Executando seed local apontando para Postgres em 127.0.0.1:5432..."
    $env:DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/seguradora'
    npx ts-node --transpile-only prisma/seed.ts
    break
  }
  'smoke' {
    Write-Host "Executando smoke-test (scripts\smoke-test.ps1)..."
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-test.ps1
    break
  }
  'dev' {
    Write-Host "Iniciando modo dev (npm run dev:local) em uma nova janela..."
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"npm run dev:local\""
    break
  }
  'logs' {
    Write-Host "Mostrando logs do compose (app + db)..."
    docker compose logs --tail 200 --follow
    break
  }
  'help' {
    Show-Help
    break
  }
  default {
    Write-Host "Ação desconhecida: $action`n" -ForegroundColor Red
    Show-Help
    exit 2
  }
}
