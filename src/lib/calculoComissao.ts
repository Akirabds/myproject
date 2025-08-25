import { Decimal } from '@prisma/client/runtime'

export type Status = 'ATIVO' | 'INADIMPLENTE' | 'CANCELADO'

export function fnAliquota(novos: number): number {
  if (novos >= 10) return 10
  if (novos >= 7) return 7
  if (novos >= 5) return 5
  return 0
}

export function calcularResumo({
  associacoes, // todas as associacoes do consultor
  competenciaDate // Date representando o 1º dia do mês
}: {
  associacoes: Array<{ dataAssociacao: string | Date; status: Status; valorMensalidade: number }>;
  competenciaDate: Date;
}) {
  const compYear = competenciaDate.getFullYear()
  const compMonth = competenciaDate.getMonth()

  const novosNoMes = associacoes.filter(a => {
    const d = new Date(a.dataAssociacao)
    return a.status === 'ATIVO' && d.getFullYear() === compYear && d.getMonth() === compMonth
  }).length

  const aliquota = fnAliquota(novosNoMes)

  const ativos = associacoes.filter(a => {
    // considerar ativo na competência
    return a.status === 'ATIVO'
  })

  const totalAtivos = ativos.length
  const baseCalculo = ativos.reduce((s, a) => s + a.valorMensalidade, 0)
  const valorComissao = +(baseCalculo * (aliquota / 100))

  return {
    novosNoMes,
    totalAtivos,
    aliquota,
    baseCalculo: +baseCalculo.toFixed(2),
    valorComissao: +valorComissao.toFixed(2)
  }
}
