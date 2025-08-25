import { describe, it, expect, vi, beforeEach } from 'vitest'

// mock session para retornar usuário
vi.mock('../src/lib/serverSession', () => ({ getSessionServer: async () => ({ user: { id: 'u1', role: 'CONSULTOR' } }) }))

// evitar ReferenceError por hoisting do vi.mock: declarar variável com var e inicializar dentro do factory
var findManyMock: any
vi.mock('../src/lib/prisma', () => {
  // inicializa mocks aqui para evitar TDZ/hoisting issues
  const consultorFindUnique = vi.fn(() => ({ id: 'c1' }))
  findManyMock = vi.fn()
  const resumoFindUnique = vi.fn(() => null)

  return {
    prisma: {
      consultor: { findUnique: consultorFindUnique },
      associacao: { findMany: findManyMock },
      resumoMensalComissao: { findUnique: resumoFindUnique }
    }
  }
})

import handler from '../pages/api/consultores/[id]/dashboard'

describe('dashboard handler - filtro q', () => {
  beforeEach(() => {
    findManyMock.mockReset()
  })

  it('chama prisma.associacao.findMany com OR contendo numeroContrato, associado.nome e associado.documento quando q presente', async () => {
    const req: any = { method: 'GET', query: { id: 'me', competencia: '2025-08-01', q: 'ABC123' } }
    const res: any = { status: vi.fn(() => res), json: vi.fn(() => res) }

    findManyMock.mockResolvedValue([])

    await handler(req, res)

    expect(findManyMock).toHaveBeenCalled()
    const calledWhere = findManyMock.mock.calls[0][0].where
    expect(calledWhere.OR).toBeDefined()
    // checar se as 3 condições estão presentes em OR
    const hasNumero = calledWhere.OR.some((c: any) => Object.prototype.hasOwnProperty.call(c, 'numeroContrato'))
    const hasNome = calledWhere.OR.some((c: any) => c.associado && Object.prototype.hasOwnProperty.call(c.associado, 'nome'))
    const hasDocumento = calledWhere.OR.some((c: any) => c.associado && Object.prototype.hasOwnProperty.call(c.associado, 'documento'))

    expect(hasNumero).toBe(true)
    expect(hasNome).toBe(true)
    expect(hasDocumento).toBe(true)
  })
})
