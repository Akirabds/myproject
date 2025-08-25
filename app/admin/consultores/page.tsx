"use client"
import React from 'react'
import Toast from '../../../src/components/Toast'

export default function AdminConsultoresPage() {
  const [consultores, setConsultores] = React.useState<any[]>([])
  const [associados, setAssociados] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [toast, setToast] = React.useState<{ msg: string; type?: 'info' | 'success' | 'error' } | null>(null)
  const [tab, setTab] = React.useState<'consultores' | 'associados'>('consultores')

  // consultor form
  const [nome, setNome] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [senha, setSenha] = React.useState('')

  // associado form
  const [aNome, setANome] = React.useState('')
  const [aDocumento, setADocumento] = React.useState('')
  const [aConsultorId, setAConsultorId] = React.useState('')
  const [aValor, setAValor] = React.useState('')

  React.useEffect(() => { loadConsultores() }, [])

  const loadConsultores = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/consultores')
      if (!r.ok) throw new Error('Erro')
      setConsultores(await r.json())
    } catch (e) { setToast({ msg: 'Falha ao carregar consultores', type: 'error' }) }
    setLoading(false)
  }

  const loadAssociados = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/associados')
      if (!r.ok) throw new Error('Erro')
      setAssociados(await r.json())
    } catch (e) { setToast({ msg: 'Falha ao carregar associados', type: 'error' }) }
    setLoading(false)
  }

  const handleCadastrarConsultor = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/admin/consultores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, password: senha }) })
      if (!r.ok) { const b = await r.json().catch(() => ({})); setToast({ msg: b.error || 'Erro', type: 'error' }); return }
      setToast({ msg: 'Consultor cadastrado', type: 'success' })
      setNome(''); setEmail(''); setSenha('')
      await loadConsultores()
    } catch { setToast({ msg: 'Erro ao cadastrar consultor', type: 'error' }) }
    setLoading(false)
  }

  const handleCadastrarAssociado = async () => {
    if (!aNome || !aConsultorId) { setToast({ msg: 'Nome e consultor obrigatórios', type: 'error' }); return }
    setLoading(true)
    try {
      const body = { nome: aNome, documento: aDocumento, consultorId: aConsultorId, valorMensalidade: aValor ? Number(aValor) : undefined }
      const r = await fetch('/api/admin/associados', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!r.ok) { const b = await r.json().catch(() => ({})); setToast({ msg: b.error || 'Erro', type: 'error' }); return }
      setToast({ msg: 'Associado cadastrado', type: 'success' })
      setANome(''); setADocumento(''); setAConsultorId(''); setAValor('')
      await loadAssociados()
    } catch { setToast({ msg: 'Erro ao cadastrar associado', type: 'error' }) }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin — Consultores</h1>

      <div className="mb-4">
        <button onClick={() => setTab('consultores')} className={`px-3 py-1 mr-2 ${tab==='consultores' ? 'bg-slate-700 text-white' : 'bg-gray-100'}`}>Consultores</button>
        <button onClick={() => { setTab('associados'); loadAssociados() }} className={`px-3 py-1 ${tab==='associados' ? 'bg-slate-700 text-white' : 'bg-gray-100'}`}>Associados</button>
      </div>

      {tab === 'consultores' && (
        <div>
          <div className="overflow-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left"><th>Nome</th><th>Email</th></tr>
              </thead>
              <tbody>
                {consultores.map(c => (
                  <tr key={c.id} className="border-t"><td className="py-2">{c.usuario?.nome ?? c.id}</td><td>{c.usuario?.email ?? '-'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-medium mb-2">Cadastrar Consultor</h2>
            <form onSubmit={handleCadastrarConsultor} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <div><label className="block text-sm">Nome</label><input value={nome} onChange={e => setNome(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm">Email</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm">Senha</label><input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="md:col-span-3"><button disabled={loading} className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded">Cadastrar Consultor</button></div>
            </form>
          </div>
        </div>
      )}

      {tab === 'associados' && (
        <div>
          <div className="overflow-auto mb-4">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th>Nome</th><th>Consultor</th></tr></thead>
              <tbody>
                {associados.map(a => (
                  <tr key={a.id} className="border-t"><td className="py-2">{a.nome}</td><td>{a.consultor?.usuario?.nome ?? a.consultorId}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-medium mb-2">Cadastrar Associado</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div><label className="block text-sm">Nome</label><input value={aNome} onChange={e => setANome(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm">Documento</label><input value={aDocumento} onChange={e => setADocumento(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm">Consultor</label><select value={aConsultorId} onChange={e => setAConsultorId(e.target.value)} className="w-full border p-2 rounded"><option value="">-- selecione --</option>{consultores.map(c => <option key={c.id} value={c.id}>{c.usuario?.nome ?? c.id}</option>)}</select></div>
              <div><label className="block text-sm">Mensalidade (R$)</label><input value={aValor} onChange={e => setAValor(e.target.value)} className="w-full border p-2 rounded" /></div>
              <div className="md:col-span-4"><button onClick={handleCadastrarAssociado} disabled={loading} className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded">Cadastrar Associado</button></div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
