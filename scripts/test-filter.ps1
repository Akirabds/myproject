# Teste de filtro na API de dashboard
$base = 'http://127.0.0.1:3000'
$ws = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrf = (Invoke-RestMethod -Uri "$base/api/auth/csrf" -WebSession $ws -UseBasicParsing).csrfToken
$body = @{ csrfToken = $csrf; callbackUrl = $base; json = 'true'; email = 'consultor1@seguradora.test'; password = 'Consultor1@123' }
Write-Host "Fazendo login..."
$login = Invoke-WebRequest -Uri "$base/api/auth/callback/credentials" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -WebSession $ws -Headers @{ 'Accept' = 'application/json' } -UseBasicParsing -ErrorAction Stop
Write-Host "Login status:" $login.StatusCode
$comp = (Get-Date).ToString('yyyy-MM-dd')
$q = 'C-1-1'
$ub = New-Object System.UriBuilder($base + "/api/consultores/me/dashboard")
$ub.Query = "competencia=$comp&q=$q"
Write-Host "Chamando:" $ub.Uri.AbsoluteUri
$res = Invoke-RestMethod -Uri $ub.Uri.AbsoluteUri -WebSession $ws -UseBasicParsing
Write-Host "Resposta:`n" ($res | ConvertTo-Json -Depth 5)
