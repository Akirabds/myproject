"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()
  const role = (session as any)?.user?.role
  const isAdmin = role === 'ADMIN'
  const isLogged = status === 'authenticated'

  if (status !== 'authenticated') return null
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">Seguradora</div>
        <nav className="space-x-4 flex items-center">
          <Link href="/consultor/dashboard" className="text-sm text-slate-700">Dashboard</Link>
          {isAdmin && <Link href="/admin/consultores" className="text-sm text-slate-700">Admin</Link>}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-4 px-3 py-1 bg-slate-700 text-white rounded text-sm"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  )
}
