README Rápido — Atalhos

Este arquivo mostra os comandos mínimos para acelerar o desenvolvimento local.

Repositório: Next.js + Prisma(Postgres) + NextAuth

Atalhos PowerShell (arquivo: `scripts/tasks.ps1`)

- start   : sobem os containers (docker compose up -d)
- stop    : derruba os containers (docker compose down)
- build   : rebuild das imagens (docker compose build --no-cache)
- restart : reinicia apenas o container `app`
- seed    : executa o seed local (usa Postgres em 127.0.0.1:5432)
- smoke   : executa o smoke-test (scripts\smoke-test.ps1)
- dev     : inicia Next em modo dev (npm run dev:local)
- logs    : mostra logs do compose (seguindo)
- help    : mostra ajuda

Como usar (PowerShell):

# subir serviços
.
```powershell
.\scripts\tasks.ps1 start
```

# popular banco

```powershell
.\scripts\tasks.ps1 seed
```

# smoke-test (login -> dashboard -> recalcular)

```powershell
.\scripts\tasks.ps1 smoke
```

Exemplos diretos (scripts npm adicionados):

```powershell
# executar smoke via npm
npm run smoke

# executar seed local via npm
npm run seed:local
```

Arquivo de referência: `scripts/tasks.ps1` e `scripts/smoke-test.ps1`.

Uso via npm

Também é possível executar os atalhos através do npm (atrelado ao script `tasks` no `package.json`). Exemplos:

```powershell
# mostra ajuda
npm run tasks -- help

# start
npm run tasks -- start

# seed
npm run tasks -- seed

# smoke-test
npm run tasks -- smoke
```
