README - Desenvolvimento (DEV)

Resumo rápido
- Objetivo: instruções para rodar localmente, aplicar schema, popular DB e executar smoke tests.
- Scripts úteis:
  - `npm run apply:dev` → aplica schema (`prisma db push`), gera client, executa seed e rebuilda containers.
  - `npm run apply:dev` (PowerShell) também disponível diretamente como script.
  - `scripts/smoke-full.ps1` → faz `apply:dev` e em seguida roda o `scripts/smoke-test.ps1`.

Pré-requisitos
- Docker & Docker Compose
- Node.js >= 20, npm
- PowerShell (Windows)
- Postgres acessível (o padrão usado é `postgres://postgres:postgres@127.0.0.1:5432/seguradora`)

Instalação local (opcional — só se for rodar seed/testes no host)
```powershell
npm install
npx prisma generate
```

Comandos Docker (imagem já contém build Next.js)
```powershell
docker compose build --no-cache
docker compose up -d
```

Sincronizar schema, seed e rebuild (automático)
- Atalho (recomendado para DEV):
```powershell
npm run apply:dev
```
- O que o script faz (`scripts/apply-migrate-seed.ps1`):
  1. `npx prisma db push` (aplica schema diretamente no banco)
  2. `npx prisma generate` (regenera Prisma Client)
  3. `npx ts-node --transpile-only prisma/seed.ts` (seed idempotente)
  4. `docker compose build --no-cache` e `docker compose up -d`
  5. checagens rápidas (porta 3000 e `/api/admin/consultores`)

Smokes e validação pós-deploy
- Execução completa (apply + smoke):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-full.ps1
```
- Smoke test isolado (login + dashboard + recalcular):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-test.ps1
```

Seed e credenciais (padrão do seed)
- Para popular manualmente:
```powershell
$env:DATABASE_URL='postgres://postgres:postgres@127.0.0.1:5432/seguradora'
npx ts-node --transpile-only prisma/seed.ts
```
- Credenciais geradas pelo seed:
  - Admin: `admin@seguradora.test` / `Admin@123`
  - Consultor 1: `consultor1@seguradora.test` / `Consultor1@123`

Nota sobre Migrations vs db push
- `prisma db push` sincroniza o schema com o banco rapidamente (sem criar histórico de migrations) — útil em desenvolvimento.
- Para um histórico de migrations (produção ou controle rígido), gere e aplique migrations com:
  ```powershell
  npx prisma migrate dev --create-only --name <nome>
  # revise a SQL gerada e então
  npx prisma migrate deploy
  ```
- O repositório contém migrations na pasta `prisma/migrations`; usar `migrate dev` pode falhar contra shadow DB se o estado estiver inconsistente — nesse caso use `db push` para DEV ou resolva o estado das migrations.

Comandos npm úteis (no `package.json`)
- `npm run dev` — next dev
- `npm run build` — build
- `npm run apply:dev` — convenience script (apply/seed/rebuild)
- `npm run seed` — executa seed via ts-node
- `npm test` — vitest

Dicas e troubleshooting
- Se aparecer erro do Prisma sobre engines (ex: `debian-openssl-1.1.x`), rode `npx prisma generate` e rebuild da imagem.
- Se houver erro `Cannot find package 'bcryptjs'`, rode `npm install bcryptjs --save` e `npm install @types/bcryptjs --save-dev`.
- O endpoint `/api/admin/consultores` é protegido e pode retornar 401/403 sem autenticação — isso é normal.

Contato
- Se quiser, eu posso:
  - adicionar um `README-DEV.md` mais detalhado ou um `Makefile` com alvos convenientes;
  - criar scripts para CI que rodem migrations + seed em ambiente controlado.

Fim.
