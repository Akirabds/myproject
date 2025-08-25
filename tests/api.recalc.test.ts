import { describe, it, expect, vi, beforeEach } from 'vitest'

// testar lógica de bloqueio consolidado mockando prisma
import * as recalcularHandler from '../pages/api/consultores/[id]/recalcular'
import * as consolidarHandler from '../pages/api/consultores/[id]/consolidar'

vi.mock('../src/lib/serverSession', () => ({ getSessionServer: async () => ({ user: { id: 'u1', role: 'CONSULTOR' } }) }))
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    consultor: { findUnique: vi.fn(() => ({ id: 'c1' })) },
    resumoMensalComissao: {
  findUnique: vi.fn(() => ({ id: 'r1', consolidado: true })),
  upsert: vi.fn(),
  update: vi.fn(() => ({ id: 'r1', consolidado: true }))
    },
    associacao: { findMany: vi.fn(() => []) }
  }
}))

describe('API recalcular/consolidar behavior', () => {
  it('recalcular returns 409 when consolidated', async () => {
    const req: any = { method: 'POST', query: { id: 'me', competencia: '2025-08-01' } }
    const res: any = { status: vi.fn(() => res), json: vi.fn(() => res), end: vi.fn() }

    await recalcularHandler.default(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
  })

  it('consolidar returns 200 when admin allowed', async () => {
    // mock session as ADMIN by replacing module mock
    vi.mock('../src/lib/serverSession', () => ({ getSessionServer: async () => ({ user: { id: 'u1', role: 'ADMIN' } }) }))
    const req: any = { method: 'POST', query: { id: 'me', competencia: '2025-08-01' } }
    const res: any = { status: vi.fn(() => res), json: vi.fn(() => res), end: vi.fn() }

    await consolidarHandler.default(req, res)
    expect(res.json).toHaveBeenCalled()
  })
})
