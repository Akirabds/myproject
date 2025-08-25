"# Smoke test PowerShell para login e chamadas protegidas"
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-test.ps1

$base = 'http://127.0.0.1:3000'

# cria WebSession para manter cookies
$ws = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# pega CSRF token dentro da mesma sessão (importante para o cookie de CSRF)
$csRes = Invoke-RestMethod -Uri "$base/api/auth/csrf" -WebSession $ws -UseBasicParsing
$csrf = $csRes.csrfToken

# prepara corpo do form (credentials provider espera form-urlencoded)
$body = @{ csrfToken = $csrf; callbackUrl = $base; json = 'true'; email = 'consultor1@seguradora.test'; password = 'Consultor1@123' }

Write-Host "Fazendo login como consultor1@seguradora.test..."
# usa Invoke-WebRequest para capturar possíveis redirecionamentos mas mantendo cookies
$login = Invoke-WebRequest -Uri "$base/api/auth/callback/credentials" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -WebSession $ws -Headers @{ 'Accept' = 'application/json' } -UseBasicParsing -ErrorAction SilentlyContinue
Write-Host "Login response status: $($login.StatusCode)"
if ($login.Headers.Location) { Write-Host "Login redirect: $($login.Headers.Location)" }

Write-Host "Chamando dashboard (competencia=2025-08)..."
try {
	$dash = Invoke-RestMethod -Uri "$base/api/consultores/me/dashboard?competencia=2025-08" -WebSession $ws -UseBasicParsing
		Write-Host "Dashboard response:`n$(($dash | ConvertTo-Json -Depth 5) -replace '\\n','`n')"
} catch {
	Write-Host "Dashboard request falhou:`n$($_.Exception.Message)"
}

Write-Host "Chamando recalcular (competencia=2025-08)..."
try {
	$recalc = Invoke-RestMethod -Uri "$base/api/consultores/me/recalcular?competencia=2025-08" -Method Post -WebSession $ws -Headers @{ 'Accept' = 'application/json' } -UseBasicParsing
		Write-Host "Recalcular response:`n$(($recalc | ConvertTo-Json -Depth 5) -replace '\\n','`n')"
} catch {
	Write-Host "Recalcular request falhou:`n$($_.Exception.Message)"
}
