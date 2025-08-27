Set-Location 'C:\http'
Write-Host 'Fetching origin...'
git fetch origin --prune

# ensure feature branch exists locally
if (-not (git show-ref --verify --quiet 'refs/heads/feature/dashboard-contract-pr')) {
    Write-Host 'feature/dashboard-contract-pr not found locally — fetching from origin'
    git fetch origin feature/dashboard-contract-pr:feature/dashboard-contract-pr
}

Write-Host 'Checking out feature branch...'
git checkout feature/dashboard-contract-pr

# delete existing pr/base
if (git show-ref --verify --quiet 'refs/heads/pr/base') {
    Write-Host 'Deleting existing local pr/base'
    git branch -D pr/base
}

# create pr/base from origin/master or master
if (git show-ref --verify --quiet 'refs/remotes/origin/master') {
    Write-Host 'Creating pr/base from origin/master'
    git checkout -b pr/base origin/master
} elseif (git show-ref --verify --quiet 'refs/heads/master') {
    Write-Host 'Creating pr/base from local master'
    git checkout -b pr/base master
} else {
    Write-Host 'No master branch found on origin or locally — aborting'
    exit 2
}

Write-Host 'Pushing pr/base to origin'
git push -u origin pr/base --force

# PR body
$body = @'
feat: dashboard q filter, tests and schema updates

Resumo das mudanças:
- Filtro q no endpoint do dashboard (numeroContrato, associado.nome, associado.documento)
- Ajuste no Prisma schema (numeroContrato único) e seed atualizada
- Testes Vitest adicionados/ajustados
- Correções de merge markers e prisma singleton
'@

Write-Host 'Creating PR via gh...'
& 'C:\Program Files\GitHub CLI\gh.exe' pr create --base pr/base --head feature/dashboard-contract-pr --title 'feat: dashboard q filter, tests and schema updates' --body $body --web
