"use client"
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { user, signIn, signUp, signOut } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [err, setErr] = useState<string | null>(null)
  const [accept, setAccept] = useState(true)
  const router = useRouter()

  if (user) {
    return (
      <div className="space-y-4">
        <div className="text-xl">Hola, {user.email}</div>
        <button className="btn btn-secondary" onClick={() => signOut().then(() => router.push('/'))}>{t('action.signout')}</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('auth.title')}</h1>
        <p className="muted">{t('auth.subtitle')}</p>
      </div>
      <form
        className="card p-5 space-y-4 max-w-md mx-auto"
        onSubmit={async (e) => {
          e.preventDefault()
          setErr(null)
          try {
            if (mode === 'in') {
              await signIn(email, password)
            } else {
              if (!accept) { setErr('Debes aceptar la Politica de Privacidad y Cookies.'); return }
              if (!displayName.trim()) { setErr('Indica un nombre o nick para mostrar.'); return }
              await signUp(email, password)
              try {
                const { createClient } = await import('@supabase/supabase-js')
                const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { storageKey: 'nighthub-auth', persistSession: true, autoRefreshToken: true } })
                const u = (await sb.auth.getUser()).data.user
                if (u) {
                  await sb.from('users').upsert({ id: u.id, email: u.email as string, display_name: displayName.trim() })
                }
              } catch {}
            }
            router.push('/')
          } catch (e: any) {
            setErr(e.message || 'Error')
          }
        }}
      >
        <label className="block text-sm">{t('auth.email')}</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full h-12 text-base bg-transparent border border-white/20 rounded-xl px-3" placeholder="email@ejemplo.com" />
        <label className="block text-sm mt-2">{t('auth.password')}</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full h-12 text-base bg-transparent border border-white/20 rounded-xl px-3" placeholder="********" />
        {mode === 'up' && (
          <>
            <label className="block text-sm mt-2">Nombre o nick a mostrar</label>
            <input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} className="w-full h-12 text-base bg-transparent border border-white/20 rounded-xl px-3" placeholder="Tu nombre o nick" required />
          </>
        )}
        {err && <div className="text-red-400 text-sm">{err}</div>}
        {mode === 'up' && (
          <label className="flex items-start gap-2 text-xs md:text-sm text-white/80 leading-snug">
            <input type="checkbox" className="mt-0.5" checked={accept} onChange={e=>setAccept(e.target.checked)} />
            <span>
              {t('consent.accept')} <a className="underline" href="/privacy" target="_blank">{t('account.privacy_policy')}</a> {t('consent.and')} <a className="underline" href="/cookies" target="_blank">{t('account.cookies')}</a>.
            </span>
          </label>
        )}
        <button className="btn btn-primary w-full mt-1 py-3 text-base" disabled={mode==='up' && !accept}>{mode === 'in' ? t('auth.signin') : t('auth.signup')}</button>
        <div className="text-center text-xs text-white/60">
          {mode === 'in' ? (
            <button type="button" className="underline" onClick={()=>setMode('up')}>{t('auth.to_signup')}</button>
          ) : (
            <button type="button" className="underline" onClick={()=>setMode('in')}>{t('auth.to_signin')}</button>
          )}
        </div>
      </form>

      <div className="card p-4 space-y-2 max-w-xl">
        <div className="font-medium text-lg">{t('benefits.title')}</div>
        <ul className="list-disc pl-5 text-white/80 text-sm">
          <li>{t('benefits.save')}</li>
          <li>{t('benefits.follow')}</li>
          <li>{t('benefits.tickets')}</li>
          <li>{t('benefits.sync')}</li>
          <li>{t('benefits.reviews')}</li>
          <li>{t('benefits.push')}</li>
        </ul>
      </div>
    </div>
  )
}
