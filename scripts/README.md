# Scripts de conveniência

Este diretório contém scripts auxiliares para desenvolvimento local.

## apply-migrate-seed.ps1

Propósito:
- Aplicar o schema do Prisma no banco (modo rápido para desenvolvimento), regenerar o Prisma Client, executar o `seed` (idempotente) e rebuildar/reiniciar os containers Docker.

Resumo do que o script faz:
1. Usa `npx prisma db push` para sincronizar o schema do `prisma/schema.prisma` com o banco.
2. Roda `npx prisma generate` para atualizar o client.
3. Executa `prisma/seed.ts` via `ts-node` (idempotente).
4. Rebuilda a imagem Docker e reinicia os containers (`docker compose build --no-cache` + `docker compose up -d`).
5. Faz checagens básicas (porta 3000 e endpoint `/api/admin/consultores`).

Avisos importantes:
- O script usa `prisma db push`, que aplica o schema diretamente no banco sem criar um histórico de migrations. Isso é prático para desenvolvimento, mas não é recomendado em produção ou quando você precisa manter um histórico de migrations.
- Se quiser usar migrations (histórico), gere uma migration adequada e aplique-a com `prisma migrate` manualmente.

Pré-requisitos:
- Docker & Docker Compose
- Node.js (>=20) + npm
- PowerShell (Windows)
- `DATABASE_URL` apontando para o banco Postgres (padrão usado no script: `postgres://postgres:postgres@127.0.0.1:5432/seguradora`)

Como usar

- Execução com valores padrão (usa DB local):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\apply-migrate-seed.ps1
```

- Especificando um DATABASE_URL (exemplo):
```powershell
$env:DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/seguradora'
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\apply-migrate-seed.ps1
```

- Você também pode passar um nome de migration (o script ignora `migrate dev` por padrão ao usar `db push`, o parâmetro existe apenas por compatibilidade):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\apply-migrate-seed.ps1 -MigrationName add-numero-contrato
```

Saída esperada
- Mensagens informando cada passo (db push, generate, seed, build, up). No final, o script verifica se a porta 3000 está aberta e faz uma requisição rápida ao endpoint `/api/admin/consultores` (este endpoint pode responder 401/403 sem autenticação - isso é normal).

Dicas
- Para manter histórico de migrations em um fluxo mais controlado, gere uma migration com `npx prisma migrate dev --create-only --name <nome>` e revise o SQL antes de aplicar com `prisma migrate deploy`.
- Se preferir um comportamento não-interativo, exporte `DATABASE_URL` antes de executar o script.

Licença
- Mesmo licenciamento do projeto principal.
