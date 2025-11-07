"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    if (!user) { setOk(false); return }
    const email = (user.email || '').toLowerCase()
    // Owner bypass to avoid hanging checks
    if (email === 'seoclaro22@gmail.com') { setOk(true); return }
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { storageKey: 'nighthub-auth', persistSession: true, autoRefreshToken: true } }
    )
    ;(async () => {
      let resolved = false
      const to = setTimeout(() => { if (!resolved) setOk(false) }, 5000)
      try {
        const { data, error } = await sb.rpc('is_moderator', { uid: user.id })
        if (!error && typeof data === 'boolean') { resolved = true; clearTimeout(to); setOk(!!data); return }
      } catch {}
      try {
        const { data } = await sb.from('users').select('roles').eq('id', user.id).maybeSingle()
        const roles: any = data?.roles
        const list: string[] = Array.isArray(roles)
          ? roles
          : (typeof roles === 'string' ? roles.replace(/[{}]/g, '').split(',') : [])
        resolved = true; clearTimeout(to)
        setOk(list.includes('moderator') || list.includes('admin'))
        return
      } catch {}
      resolved = true; clearTimeout(to)
      setOk(false)
    })()
  }, [user])
  if (ok === null) return <div className="muted">Cargando...</div>
  if (!ok) return <div className="muted">No tienes permisos para acceder al Back Office.</div>
  return <>{children}</>
}
