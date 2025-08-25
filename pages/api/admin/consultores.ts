import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'
import { getSessionServer } from '../../../src/lib/serverSession'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSessionServer(req, res)
  if (!session || (session as any).user.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' })

  if (req.method === 'GET') {
    const consultores = await prisma.consultor.findMany({ include: { usuario: true } })
    return res.json(consultores)
  }

  if (req.method === 'POST') {
    const { nome, email, password } = req.body || {}
    if (!nome || !email || !password) return res.status(400).json({ error: 'nome, email and password required' })
    // checar duplicidade
    const exists = await prisma.usuario.findUnique({ where: { email } })
    if (exists) return res.status(409).json({ error: 'email already exists' })
    const bcrypt = (await import('bcryptjs')).default
    const hash = bcrypt.hashSync(password, 10)
    const usuario = await prisma.usuario.create({ data: { nome, email, senhaHash: hash, role: 'CONSULTOR' } as any })
    const consultor = await prisma.consultor.create({ data: { usuarioId: usuario.id } })
    return res.status(201).json({ ...consultor, usuario })
  }

  return res.status(405).end()
}
