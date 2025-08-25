import { calcularResumo, fnAliquota } from '../src/lib/calculoComissao'
import { test, expect } from 'vitest'

test('cenário: 20 ativos anteriores + 7 novos no mês => comissão 378', () => {
  const competencia = new Date('2025-08-01T00:00:00-03:00')

  // 20 ativos anteriores (dataAssociacao anterior ao mês)
  const anteriores = Array.from({ length: 20 }).map((_, i) => ({
    dataAssociacao: '2025-01-01T00:00:00-03:00',
    status: 'ATIVO' as const,
    valorMensalidade: 200
  }))

  // 7 novos no mês
  const novos = Array.from({ length: 7 }).map((_, i) => ({
    dataAssociacao: '2025-08-05T00:00:00-03:00',
    status: 'ATIVO' as const,
    valorMensalidade: 200
  }))

  const todas = [...anteriores, ...novos]

  const res = calcularResumo({ associacoes: todas, competenciaDate: competencia })

  expect(res.novosNoMes).toBe(7)
  expect(res.aliquota).toBe(7)
  expect(res.totalAtivos).toBe(27)
  expect(res.baseCalculo).toBe(5400)
  expect(res.valorComissao).toBe(378)
})
