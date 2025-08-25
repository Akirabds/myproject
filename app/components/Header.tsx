"use client"
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  const role = (session as any)?.user?.role
  const isAdmin = role === 'ADMIN'

  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">Seguradora</div>
        <nav className="space-x-4">
          <Link href="/login" className="text-sm text-slate-700">Login</Link>
          <Link href="/consultor/dashboard" className="text-sm text-slate-700">Dashboard</Link>
          {isAdmin && <Link href="/admin/consultores" className="text-sm text-slate-700">Admin</Link>}
        </nav>
      </div>
    </header>
  )
}
