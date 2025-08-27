Set-Location 'C:\http'
# nome do branch de origem (contendo as mudanças)
$source = 'feature/dashboard-contract-pr'
# branch limpo novo que vamos criar
$target = 'pr/changes-for-pr'

# garantir que temos a origem
git fetch origin --prune

# delete local target se existir
if (git show-ref --verify --quiet "refs/heads/$target") { git branch -D $target }

# criar branch a partir de pr/base (que existe remoto e local)
if (git show-ref --verify --quiet 'refs/heads/pr/base') {
    git checkout pr/base
    git checkout -b $target
} else {
    git checkout -b $target
}

# lista dos arquivos que mudaram no source branch compared with pr/base
$files = git diff --name-only pr/base..$source
Write-Host "Files to copy:`n$files"

# copiar cada arquivo do source para o target
foreach ($f in $files) {
    git checkout $source -- $f
}

# commitar e push
git add -A
git commit -m "chore: cherry-pick source files from $source" --allow-empty
git push -u origin $target --force

# criar PR usando gh
$body = Get-Content PR_BODY.md -Raw
& 'C:\Program Files\GitHub CLI\gh.exe' pr create --base pr/base --head $target --title 'feat: dashboard q filter, tests and schema updates' --body-file PR_BODY.md --web
