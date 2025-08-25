$base = "http://127.0.0.1:3000"
$ws = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrf = (Invoke-RestMethod -Uri "$base/api/auth/csrf" -WebSession $ws -UseBasicParsing).csrfToken
$body = @{ csrfToken = $csrf; callbackUrl = $base; json = 'true'; email = 'admin@seguradora.test'; password = 'Admin@123' }
Write-Host "Logging in as admin..."
$login = Invoke-WebRequest -Uri "$base/api/auth/callback/credentials" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -WebSession $ws -Headers @{ 'Accept' = 'application/json' } -UseBasicParsing -ErrorAction SilentlyContinue
Write-Host "Login status:" $login.StatusCode
Write-Host "Fetching consultores..."
$consultores = Invoke-RestMethod -Uri "$base/api/admin/consultores" -WebSession $ws -UseBasicParsing
Write-Host "Consultores count:" $($consultores.Count)
if ($consultores.Count -gt 0) {
  $cid = $consultores[0].id
  Write-Host "Using consultor id=$cid"
  $comp = (Get-Date).ToString('yyyy-MM-dd')
  # Garantir que exista um resumo para a competencia antes de consolidar
  Write-Host "Chamando recalcular (competencia=$comp) para criar/upsert do resumo..."
  try {
    $rec = Invoke-RestMethod -Uri "$base/api/consultores/$cid/recalcular?competencia=$comp" -Method Post -WebSession $ws -UseBasicParsing
    Write-Host "Recalcular response:`n$($rec | ConvertTo-Json -Depth 5)"
  } catch {
    Write-Host "Recalcular failed:`n$($_.Exception.Message)"
    if ($_.Exception.Response) { Write-Host "Status:" $_.Exception.Response.StatusCode.Value__ }
  }
  try {
    $res = Invoke-RestMethod -Uri "$base/api/consultores/$cid/consolidar?competencia=$comp" -Method Post -WebSession $ws -UseBasicParsing
    Write-Host "Consolidar response:`n$($res | ConvertTo-Json -Depth 5)"
  } catch {
    Write-Host "Consolidar failed:`n$($_.Exception.Message)"
    if ($_.Exception.Response) { Write-Host "Status:" $_.Exception.Response.StatusCode.Value__ }
  }
} else { Write-Host "No consultores found" }
