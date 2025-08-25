# Seguradora - Comissões

Projeto exemplo para cálculo de comissões de consultores.

Este README foi estendido com passos rápidos para iniciar o projeto localmente, popular o banco (seed) e executar um smoke-test no Windows PowerShell.

Pré-requisitos
- Docker & Docker Compose
- Node.js (>=20) e npm (para rodar seed/localmente)
- PowerShell (Windows)

Passos rápidos

1) Instalar dependências (somente se for usar seed/testes no host)

```powershell
npm install
npx prisma generate
```

2) Subir serviços com Docker (imagem contém build Next.js)

```powershell
docker compose build --no-cache
docker compose up -d
```

A aplicação estará em: http://127.0.0.1:3000

3) Popular o banco (seed)

```powershell
$env:DATABASE_URL='postgres://postgres:postgres@127.0.0.1:5432/seguradora'
npx ts-node --transpile-only prisma/seed.ts
```

O seed é idempotente — pode ser executado várias vezes sem duplicar chaves únicas.

4) Smoke-test (login + dashboard + recalcular)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke-test.ps1
```

Nota: o script `scripts\smoke-admin.ps1` chama primeiro o endpoint `recalcular` antes de `consolidar` para garantir que exista um resumo a ser consolidado; mantenha esse comportamento para os smoke-tests automatizados.

Credenciais seed (padrão)
- Admin: `admin@seguradora.test` / `Admin@123`
- Consultor 1: `consultor1@seguradora.test` / `Consultor1@123`

Scripts npm úteis
- `npm run dev` (modo dev)
- `npm run build` (build)
- `npm run migrate:dev` (migrate dev)
- `npm run seed` (executa seed via ts-node)

Script de conveniência
- `scripts\start-local.ps1` — automatiza build/start do Docker Compose, aguarda DB healthy, executa seed e verifica se a app responde em `http://127.0.0.1:3000`.

Testes
- `npm test` (Vitest)

Problemas comuns
- Erro: Cannot find package 'bcryptjs'
	- Rode `npm install bcryptjs --save` e `npm install @types/bcryptjs --save-dev`.
- Erro do Prisma sobre query engine (ex: debian-openssl-1.1.x)
	- Verifique `prisma/schema.prisma` para incluir os `binaryTargets` e rode `npx prisma generate`.
	- Rebuild da imagem: `docker compose build --no-cache`.

Se quiser, posso adicionar tarefas de conveniência (ex.: `ps1` com start/seed/smoke-test) ou um Makefile. Diga o que prefere.

Observação: adicionei um novo campo `numeroContrato` em `Associacao` para ter um número de contrato legível; antes de rodar o `prisma/seed.ts` em um banco existente, aplique a migration localmente:

```powershell
npx prisma migrate dev --name add-numero-contrato
npx prisma generate
```

O seed agora popula `numeroContrato` com um identificador simples (ex: `C-1-5`).

Para aplicar a constraint de `unique` no campo `numeroContrato`, rode localmente o script de conveniência:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\apply-migration-numero-contrato.ps1
```

Em seguida rode o `scripts\start-local.ps1` para rebuild/start e seed.
