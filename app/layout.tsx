import './globals.css'
import React from 'react'
import Link from 'next/link'
import Providers from './providers'
import Header from './components/Header'
// ...existing code... (removed unused auth import)

export const metadata = {
  title: 'Seguradora - Comissões',
  description: 'Painel de comissões para consultores e administradores',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // O Header só será exibido se o usuário estiver logado (lado do cliente)
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {/* Header só renderiza o menu se o usuário estiver logado */}
          <Header />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
