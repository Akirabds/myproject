import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'
import { getSessionServer } from '../../../src/lib/serverSession'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSessionServer(req, res)
  if (!session || (session as any).user.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' })
  const now = new Date()
  const comp = new Date(now.getFullYear(), now.getMonth(), 1)

  // total consultores
  const totalConsultores = await prisma.consultor.count()

  // total consultores com ao menos 1 associado ATIVO
  const ativos = await prisma.associacao.findMany({ where: { status: 'ATIVO' }, distinct: ['consultorId'], select: { consultorId: true } as any })
  const totalConsultoresAtivos = ativos.length

  // total comissao do mes: para cada consultor, buscar resumo ou calcular
  const consultores = await prisma.consultor.findMany()
  let totalComissao = 0
  for (const c of consultores) {
    const resumo = await prisma.resumoMensalComissao.findUnique({ where: { consultorId_competencia: { consultorId: c.id, competencia: comp } as any } })
    if (resumo) {
      totalComissao += Number(resumo.valorComissao || 0)
    } else {
      const associacoes = await prisma.associacao.findMany({ where: { consultorId: c.id } })
      const { calcularResumo } = await import('../../../src/lib/calculoComissao')
      const r = calcularResumo({ associacoes: associacoes.map(a => ({ dataAssociacao: a.dataAssociacao, status: a.status as any, valorMensalidade: Number(a.valorMensalidade) })), competenciaDate: comp })
      totalComissao += Number(r.valorComissao || 0)
    }
  }

  // associados totals
  const totalAssociados = await prisma.associado.count()
  const associadosAtivos = await prisma.associacao.findMany({ where: { status: 'ATIVO' }, distinct: ['associadoId'], select: { associadoId: true } as any })
  const totalAssociadosAtivos = associadosAtivos.length

  // total pago pelos associados no mês (pagamentos na competencia)
  const pagamentos = await prisma.pagamento.findMany({ where: { competencia: { gte: comp, lt: new Date(comp.getFullYear(), comp.getMonth() + 1, 1) } } })
  const totalPagoAssociados = pagamentos.reduce((s, p) => s + Number(p.valorPago || 0), 0)

  return res.json({ totalConsultores, totalConsultoresAtivos, totalComissao, totalAssociados, totalAssociadosAtivos, totalPagoAssociados })
}
