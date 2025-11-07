"use client"
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'

function client() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { storageKey: 'nighthub-auth', persistSession: true, autoRefreshToken: true } }) }

export function WriteReview({ targetType = 'event', targetId }: { targetType?: 'event'|'club'; targetId: string }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<string| null>(null)
  const { t } = useI18n()
  if (!user) return <div className="muted">{t('reviews.login')}</div>

  return (
    <form className="card p-3 space-y-2" onSubmit={async (e)=>{
      e.preventDefault()
      const { error } = await client().from('reviews').insert({ user_id: user.id, target_type: targetType, target_id: targetId, text, status: 'pending' })
      if (error) setMsg(error.message)
      else { setMsg('Enviada para moderacion'); setText('') }
    }}>
      <div className="text-sm">{t('reviews.write_hint')}</div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-xl p-2" rows={3} required />
      {msg && <div className="text-xs text-white/60">{msg}</div>}
      <button className="btn btn-secondary">Enviar resena</button>
    </form>
  )
}
