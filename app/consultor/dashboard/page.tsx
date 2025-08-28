"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import Toast from '../../../src/components/Toast'

type Resumo = {
  novosNoMes: number
  totalAtivos: number
  aliquota: number
  baseCalculo: number
  valorComissao: number
  totalInativos?: number
  valoresNoMes?: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const isAdmin = !!(session && (session as any).user && (session as any).user.role === 'ADMIN')
  const [resumo, setResumo] = React.useState<Resumo | null>(null)
  const [competencia, setCompetencia] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = React.useState(false)
  // ...existing code...
  const [toast, setToast] = React.useState<{ msg: string; type?: 'info' | 'success' | 'error' } | null>(null)
  const [consolidado, setConsolidado] = React.useState(false)
  const [consolidadoEm, setConsolidadoEm] = React.useState<string | null>(null)
  const [consolidadoPor, setConsolidadoPor] = React.useState<string | null>(null)
  const [consolidadoPorEmail, setConsolidadoPorEmail] = React.useState<string | null>(null)

  async function load() {
    setLoading(true)
    const comp = new Date(competencia).toISOString().slice(0, 10)
    const r = await fetch(`/api/consultores/me/dashboard?competencia=${comp}`)
    const data = await r.json()
  setResumo({
    novosNoMes: data.novosNoMes,
    totalAtivos: data.totalAtivos,
    aliquota: data.aliquota,
    baseCalculo: data.baseCalculo,
    valorComissao: data.valorComissao,
    totalInativos: data.totalInativos || 0,
    valoresNoMes: data.valoresNoMes || 0,
  } as Resumo)
  setConsolidado(!!data.consolidado)
  setConsolidadoEm(data.consolidadoEm || null)
  setConsolidadoPor(data.consolidadoPor || null)
  setConsolidadoPorEmail(data.consolidadoPorEmail || null)
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  async function handleRecalcular() {
    setLoading(true)
    const comp = new Date(competencia).toISOString().slice(0, 10)
    const res = await fetch(`/api/consultores/me/recalcular?competencia=${comp}`, { method: 'POST' })
    if (!res.ok) {
      if (res.status === 409) {
        const err = await res.json().catch(() => ({ error: 'Resumo já consolidado para esta competência.' }))
        setToast({ msg: `Não é possível recalcular: ${err.error}`, type: 'error' })
      } else {
        const err = await res.json().catch(() => ({ error: 'unknown' }))
        setToast({ msg: `Erro: ${err.error || 'não foi possível recalcular'}`, type: 'error' })
      }
    } else {
      setToast({ msg: 'Recalculado com sucesso', type: 'success' })
    }
    await load()
  }

  async function handleConsolidar() {
    setLoading(true)
    const comp = new Date(competencia).toISOString().slice(0, 10)
    const res = await fetch(`/api/consultores/me/consolidar?competencia=${comp}`, { method: 'POST' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'unknown' }))
      setToast({ msg: `Erro: ${err.error || 'não foi possível consolidar'}`, type: 'error' })
    } else {
      setToast({ msg: 'Consolidado com sucesso', type: 'success' })
    }
    await load()
  }

  const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  // ...existing code...

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium mb-4">Totais de Consultores</h3>
        <div className="space-x-2">
          <button onClick={handleRecalcular} className="px-3 py-1 bg-sky-600 text-white rounded" disabled={loading || consolidado}>Recalcular</button>
          {isAdmin && (
            <button onClick={handleConsolidar} className="px-3 py-1 bg-emerald-600 text-white rounded" disabled={loading}>Consolidar</button>
          )}
        </div>
      </div>

      {consolidado && (
        <div className="mb-4 p-3 bg-yellow-50 border rounded">
          <div className="text-sm font-medium">Resumo consolidado</div>
          <div className="text-xs text-slate-600">Consolidado em: {consolidadoEm ? new Date(consolidadoEm).toLocaleString('pt-BR') : '--'}</div>
          <div className="text-xs text-slate-600">Consolidado por: {consolidadoPor ?? '--'}{consolidadoPorEmail ? <span className="ml-2 text-xs text-slate-400" title={consolidadoPorEmail}>📧</span> : ''}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded">Novos no mês: {resumo ? resumo.novosNoMes : '--'}</div>
        <div className="p-4 border rounded">Total ativos: {resumo ? resumo.totalAtivos : '--'}</div>
        <div className="p-4 border rounded">Comissão do mês: {resumo ? resumo.aliquota + '%' : '--'}</div>
        <div className="p-4 border rounded">Comissão estimada: {resumo ? fmt.format(resumo.valorComissao) : '--'}</div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Totais de Associados</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded">Novos no mês: {resumo ? resumo.novosNoMes : '--'}</div>
          <div className="p-4 border rounded">Total ativos: {resumo ? resumo.totalAtivos : '--'}</div>
          <div className="p-4 border rounded">Total inativos: {resumo ? resumo.totalInativos : '--'}</div>
          <div className="p-4 border rounded">Valores no mês: {resumo ? fmt.format(resumo.valoresNoMes || 0) : '--'}</div>
        </div>
      </div>

  {/* Associação/listagem de associados removida do dashboard conforme solicitado */}
  {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
