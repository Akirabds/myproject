import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionModule = await import('../../../src/lib/serverSession')
  const session = await sessionModule.getSessionServer(req, res)
  if (!session || (session as any).user.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' })

  if (req.method === 'GET') {
    const associados = await prisma.associado.findMany({ include: { Associacoes: true } })
    // reduzir para mostrar totais por associado
    const result = associados.map(a => ({ id: a.id, nome: a.nome, totalAssociacoes: a.Associacoes.length }))
    return res.json(result)
  }

  if (req.method === 'POST') {
    const { nome, documento, consultorId, valorMensalidade } = req.body || {}
    if (!nome || !consultorId) return res.status(400).json({ error: 'nome e consultorId são obrigatórios' })

    try {
      // criar associado
      const assoc = await prisma.associado.create({ data: { nome, documento: documento || null } })
      // criar associacao vinculada ao consultor fornecido
      const associacao = await prisma.associacao.create({ data: {
        associadoId: assoc.id,
        consultorId,
        valorMensalidade: valorMensalidade || 0,
        status: 'ATIVO',
        dataAssociacao: new Date()
      }})
      return res.status(201).json({ associado: assoc, associacao })
    } catch (err: any) {
      console.error('Erro criando associado:', err)
      return res.status(500).json({ error: 'Erro interno ao criar associado' })
    }
  }

  return res.status(405).end()
}
