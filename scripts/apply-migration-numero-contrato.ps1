# Aplica migration que torna Associacao.numeroContrato único e gera client
# Uso: rode a partir da raiz do projeto
$ErrorActionPreference = 'Stop'
Write-Host "Criando migration prisma: add-unique-numero-contrato"
npx prisma migrate dev --name add-unique-numero-contrato
Write-Host "Gerando Prisma Client"
npx prisma generate
Write-Host "Migration aplicada. Verifique se o banco está pronto e rode o seed se necessário."
