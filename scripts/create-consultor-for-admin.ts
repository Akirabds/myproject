import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@seguradora.test'
  const user = await prisma.usuario.findUnique({ where: { email } })
  if (!user) {
    console.error('Usuário admin não encontrado:', email)
    process.exit(1)
  }

  const existing = await prisma.consultor.findFirst({ where: { usuarioId: user.id } })
  if (existing) {
    console.log('Consultor já existe para este usuário:', existing.id)
    return
  }

  const created = await prisma.consultor.create({ data: { usuarioId: user.id } })
  console.log('Consultor criado:', created.id)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
