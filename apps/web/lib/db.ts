import { getSupabaseClient } from '@/lib/supabase'
import type { EventPublic, Club } from './types'

export async function fetchEvents(params?: { q?: string; limit?: number; from?: string; to?: string; genre?: string; zone?: string }) {
  const sb = getSupabaseClient()
  let q = sb.from('events_public').select('*').order('start_at', { ascending: true })
  if (params?.q) {
    // Búsqueda simple por nombre/desc/club
    q = q.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%,club_name.ilike.%${params.q}%`)
  }
  if (params?.from) q = q.gte('start_at', params.from)
  if (params?.to) q = q.lte('start_at', params.to)
  if (params?.genre) q = q.contains('genres', [params.genre])
  if (params?.zone) q = (q as any).eq('zone', params.zone)
  if (params?.limit) q = q.limit(params.limit)
  let { data, error } = await q
  if (error && String(error.message || '').toLowerCase().includes('zone')) {
    // Fallback si la columna 'zone' aun no existe en la vista
    const retry = await sb.from('events_public').select('*').order('start_at', { ascending: true }).limit(params?.limit || 100)
    data = retry.data as any
    error = null as any
  }
  if (error) {
    console.error('fetchEvents error', error)
    return []
  }
  return (data || []) as EventPublic[]
}

export async function fetchClubsPublic(params?: { q?: string; limit?: number; zone?: string; genre?: string }) {
  const sb = getSupabaseClient()
  let q = sb.from('clubs').select('*').eq('status','approved').order('name', { ascending: true })
  if (params?.q) q = q.ilike('name', `%${params.q}%`)
  if (params?.zone) {
    // Incluir clubs sin zona asignada para no ocultar datos antiguos
    q = (q as any).or(`zone.eq.${params.zone},zone.is.null`)
  }
  if (params?.genre) {
    // Filtrar si el array de generos contiene el genero seleccionado
    q = (q as any).contains('genres', [params.genre])
  }
  if (params?.limit) q = q.limit(params.limit)
  const { data, error } = await q
  if (error) { console.error('fetchClubsPublic error', error); return [] }
  return (data || []) as any[]
}

export async function fetchDjsPublic(params?: { q?: string; limit?: number; genre?: string }) {
  const sb = getSupabaseClient()
  let q = sb.from('djs').select('id,name,short_bio,bio,genres,images').order('name', { ascending: true })
  if (params?.q) q = q.ilike('name', `%${params.q}%`)
  if (params?.genre) q = (q as any).contains('genres', [params.genre])
  if (params?.limit) q = q.limit(params.limit)
  const { data, error } = await q
  if (error) { console.error('fetchDjsPublic error', error); return [] }
  return (data || []) as any[]
}

export async function fetchEvent(id: string) {
  const sb = getSupabaseClient()
  const { data, error } = await sb.from('events_public').select('*').eq('id', id).maybeSingle()
  if (error) {
    console.error('fetchEvent error', error)
    return null
  }
  return (data as EventPublic) || null
}

export async function fetchEventLineup(eventId: string) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('event_djs')
    .select('position,djs(name,id)')
    .eq('event_id', eventId)
    .order('position', { ascending: true })
  if (error) { console.error('fetchEventLineup error', error); return [] }
  return (data || []).map((r: any) => ({ id: r.djs?.id, name: r.djs?.name, position: r.position }))
}

export async function fetchClub(id: string) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('clubs')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.error('fetchClub error', error)
    return null
  }
  return (data as Club) || null
}

export async function fetchClubEvents(clubId: string, limit = 10) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('events_public')
    .select('*')
    .eq('club_id', clubId)
    .order('start_at', { ascending: true })
    .limit(limit)
  if (error) {
    console.error('fetchClubEvents error', error)
    return []
  }
  return (data || []) as EventPublic[]
}

export async function fetchDj(id: string) {
  const sb = getSupabaseClient()
  const { data, error } = await sb.from('djs').select('id,name,short_bio,bio,genres,images').eq('id', id).maybeSingle()
  if (error) { console.error('fetchDj error', error); return null }
  return data as any
}

export async function fetchDjEvents(djId: string, limit = 10) {
  const sb = getSupabaseClient()
  const idsRes = await sb.from('event_djs').select('event_id').eq('dj_id', djId).order('position', { ascending: true })
  const ids = (idsRes.data || []).map((r: any) => r.event_id)
  if (!ids.length) return []
  const { data, error } = await sb
    .from('events_public')
    .select('*')
    .in('id', ids)
    .order('start_at', { ascending: true })
    .limit(limit)
  if (error) { console.error('fetchDjEvents error', error); return [] }
  return (data || []) as EventPublic[]
}

export async function fetchSimilarDjs(currentId: string, genres: string[] | null | undefined, max = 1) {
  const sb = getSupabaseClient()
  const base = Array.isArray(genres) ? genres.filter(Boolean) : []
  // try overlap by genre
  let q = sb.from('djs').select('id,name,genres,images').neq('id', currentId)
  if (base.length) {
    // overlap returns rows that share any of the provided genres
    q = (q as any).overlaps('genres', base)
  }
  let { data, error } = await q.limit(10)
  if (error) { console.error('fetchSimilarDjs error', error); return [] }
  let pool = (data || []) as any[]
  if (!pool.length) {
    // fallback: any other DJs
    const { data: anyDjs } = await sb.from('djs').select('id,name,genres,images').neq('id', currentId).limit(10)
    pool = anyDjs || []
  }
  // pick up to max randomly
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
  return pool.slice(0, Math.max(0, max))
}
