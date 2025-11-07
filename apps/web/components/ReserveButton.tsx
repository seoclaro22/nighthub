"use client"
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/lib/auth'

function sb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) }

export function ReserveButton({ eventId, source='discover', children='Reservar' }: { eventId: string; source?: string; children?: React.ReactNode }) {
  const { user } = useAuth()
  async function go() {
    const uid = user?.id
    if (uid) {
      try { await sb().from('clicks').insert({ event_id: eventId, user_id: uid, source }) } catch {}
    }
    const url = `/api/out?event=${encodeURIComponent(eventId)}&source=${encodeURIComponent(source)}${uid ? `&u=${encodeURIComponent(uid)}` : ''}`
    window.location.href = url
  }
  return <button className="btn btn-primary text-sm px-3 py-1" onClick={go}>{children}</button>
}

