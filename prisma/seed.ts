import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// prisma singleton importado
async function main() {
  // criar 1 admin
  const senha = bcrypt.hashSync('Admin@123', 10)
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@seguradora.test' },
    update: {},
    create: {
      nome: 'Admin Seguro',
      email: 'admin@seguradora.test',
      senhaHash: senha,
      role: 'ADMIN'
    }
  })

  // criar 3 consultores
  const consultores = []
  for (let i = 1; i <= 3; i++) {
    const senhaC = bcrypt.hashSync(`Consultor${i}@123`, 10)
    // se o usuário já existir, reutiliza; evita erro Unique constraint
    let user = await prisma.usuario.findUnique({ where: { email: `consultor${i}@seguradora.test` } })
    if (!user) {
      user = await prisma.usuario.create({
        data: {
          nome: `Consultor ${i}`,
          email: `consultor${i}@seguradora.test`,
          senhaHash: senhaC,
          role: 'CONSULTOR'
        }
      })
    }

    // cria o consultor somente se não existir um para este usuário
    let consultor = await prisma.consultor.findFirst({ where: { usuarioId: user.id } })
    if (!consultor) {
      consultor = await prisma.consultor.create({ data: { usuarioId: user.id } })
    }
    consultores.push(consultor)
  }

  // criar associados e associacoes distribuidas
  const agora = new Date()
  for (const [idx, consultor] of consultores.entries()) {
    const total = 20 + idx * 5 // 20,25,30
    for (let j = 0; j < total; j++) {
      const doc = `00000000${idx}${j}`
      // cria ou reutiliza associado por documento (idempotente)
      let associado = await prisma.associado.findUnique({ where: { documento: doc } })
      if (!associado) {
        associado = await prisma.associado.create({ data: { nome: `Assoc ${idx}-${j}`, documento: doc } })
      }

      // dataAssociacao: variar entre meses para garantir casos
      const dias = Math.floor(Math.random() * 365)
      const dataAssociacao = new Date()
      dataAssociacao.setDate(dataAssociacao.getDate() - dias)

      const valor = 200 * (1 + (Math.random() - 0.5) * 0.1) // ±10%

      // cria associacao somente se não existir para este consultor+associado
      const associacaoExistente = await prisma.associacao.findFirst({ where: { consultorId: consultor.id, associadoId: associado.id } })
      if (!associacaoExistente) {
        // gerar um número de contrato legível (ex: C-<consultorIndex>-<seq>)
        const numeroContrato = `C-${idx + 1}-${j + 1}`
        await prisma.associacao.create({
          data: {
            consultorId: consultor.id,
            associadoId: associado.id,
            numeroContrato,
            status: 'ATIVO',
            valorMensalidade: Number(valor.toFixed(2)),
            dataAssociacao
          }
        })
      }
    }
  }

  console.log('Seed finalizado')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
