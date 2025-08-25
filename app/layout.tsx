import './globals.css'
import React from 'react'
import Link from 'next/link'
import Providers from './providers'
import Header from './components/Header'

export const metadata = {
  title: 'Seguradora - Comissões',
  description: 'Painel de comissões para consultores e administradores',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
  <Providers>
          <Header />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
  </Providers>
      </body>
    </html>
  )
}
