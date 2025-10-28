import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { q } = req.query as any
  const where: any = {}
  if (q) {
    where.OR = [
      { numeroContrato: { contains: q, mode: 'insensitive' } },
      { associado: { nome: { contains: q, mode: 'insensitive' } } },
      { associado: { documento: { contains: q, mode: 'insensitive' } } },
    ]
  }
  const associacoes = await prisma.associacao.findMany({ where })
  return res.json(associacoes)
}
