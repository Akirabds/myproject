import React from 'react'

export default function Toast({ message, type = 'info' }: { message: string; type?: 'info' | 'success' | 'error' }) {
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-sky-600'
  return (
    <div className={`${bg} text-white p-2 rounded fixed right-4 bottom-4`}>{message}</div>
  )
}
