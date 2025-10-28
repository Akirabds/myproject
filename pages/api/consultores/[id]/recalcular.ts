import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import { getSessionServer } from '../../../../src/lib/serverSession'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getSessionServer(req, res)
  if (!session || !(session as any).user) return res.status(401).json({ error: 'Not authenticated' })
  const { competencia } = req.query as any
  // check resumen
  const resumo = await prisma.resumoMensalComissao.findUnique({ where: { competencia_formatted: String(competencia) } as any })
  if (resumo && resumo.consolidado) return res.status(409).json({ error: 'Resumo consolidado' })
  // else pretend to recalculate
  await prisma.resumoMensalComissao.upsert({ where: { competencia_formatted: String(competencia) } as any, update: {}, create: { competencia: new Date(String(competencia)), competencia_formatted: String(competencia), consolidado: false } as any })
  return res.json({ ok: true })
}
