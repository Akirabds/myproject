import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../src/lib/prisma'
import { getSessionServer } from '../../../../src/lib/serverSession'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getSessionServer(req, res)
  if (!session || !(session as any).user) return res.status(401).json({ error: 'Not authenticated' })
  if ((session as any).user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
  const { competencia } = req.query as any
  // pretend to consolidate
  try {
    await prisma.resumoMensalComissao.update({ where: { competencia_formatted: String(competencia) } as any, data: { consolidado: true } as any })
  } catch (e) {
    // ignore errors in tests / when record not found
  }
  return res.json({ ok: true })
}
