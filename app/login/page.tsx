"use client"
"use client"
import React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await signIn('credentials', { redirect: false, email, password, callbackUrl: '/consultor/dashboard' })
      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        // Login bem-sucedido: força redirecionamento direto para a dashboard
        router.push('/consultor/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button disabled={loading} className="bg-sky-600 text-white px-4 py-2 rounded">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
