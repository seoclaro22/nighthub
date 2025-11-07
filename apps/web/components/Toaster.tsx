"use client"
import { useEffect, useState } from 'react'

type Toast = { id: number; text: string }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    function onToast(e: any) {
      const text = e?.detail?.message || String(e?.detail || '')
      if (!text) return
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, text }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2200)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('nighthub-toast', onToast as any)
      return () => window.removeEventListener('nighthub-toast', onToast as any)
    }
  }, [])
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="card px-3 py-2 text-sm bg-black/70 border border-white/10 rounded-xl shadow-lg">
          {t.text}
        </div>
      ))}
    </div>
  )
}

