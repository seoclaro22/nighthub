import Link from 'next/link'
import { fetchEvent, fetchEventLineup, fetchClubEvents } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FavoriteButton } from '@/components/FavoriteButton'
import { ReviewsSection } from '@/components/ReviewsSection'
import { ReserveButton } from '@/components/ReserveButton'
import { T } from '@/components/T'
import { LDate } from '@/components/LDate'
import { LocalText } from '@/components/LocalText'

export default async function EventDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const e = await fetchEvent(id)
  if (!e) return notFound()
  const lineup = await fetchEventLineup(id)
  const clubId = (e as any).club_id as string | null
  const moreFromClub = clubId ? await fetchClubEvents(clubId, 5) : []
  const imgs: string[] = Array.isArray((e as any).images) ? (e as any).images : []
  const cover = imgs.length ? imgs[0] : null
  return (
    <div className="space-y-4">
      {cover ? (
        <img src={cover} alt={e.name} className="w-full aspect-[3/4] object-cover rounded-xl border border-white/10" />
      ) : (
        <div className="aspect-[3/4] w-full rounded-xl bg-white/5" />
      )}
      <h1 className="text-2xl font-semibold"><LocalText value={(e as any).name} i18n={(e as any).name_i18n} /></h1>
      <div className="muted">
        <LDate value={e.start_at} options={{ weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }} /> ·{' '}
        {clubId ? <Link className="underline hover:text-gold" href={`/club/${clubId}`}>{e.club_name || '-'}</Link> : (e.club_name || '-')}
      </div>
      {(e as any).genres && (e as any).genres.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {(e as any).genres.map((g: string, i: number) => (
            <Link key={i} href={`/genre/${encodeURIComponent(g)}`} className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10 hover:text-gold">{g}</Link>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <details className="card p-4"><summary className="font-medium"><T k="event.description" /></summary><p className="mt-2 text-sm text-white/80"><LocalText value={(e as any).description} i18n={(e as any).description_i18n} /></p></details>
        <details className="card p-4"><summary className="font-medium"><T k="event.lineup" /></summary>
          <div className="mt-2 text-sm text-white/80">
            {lineup.length ? lineup.map(d => (
              <div key={d.id}><Link href={`/dj/${d.id}`} className="underline hover:text-gold">{d.name}</Link></div>
            )) : '-'}
          </div>
        </details>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(e as any).url_referral ? (
          <ReserveButton eventId={(e as any).id} source="details"><T k="action.reserve_tickets" /></ReserveButton>
        ) : (
          <span className="btn btn-secondary opacity-60 cursor-not-allowed"><T k="event.no_reservations" /></span>
        )}
        <Link className="btn btn-secondary" href={`https://maps.google.com?q=${encodeURIComponent((e as any).club_name || 'Mallorca')}`} target="_blank"><T k="action.directions" /></Link>
      </div>
      <FavoriteButton eventId={(e as any).id} useLocalCache />
      <ReviewsSection targetType="event" targetId={(e as any).id} />
      {moreFromClub.length > 0 && (
        <div className="card p-4 space-y-2">
          <div className="font-medium">Mas en {e.club_name}</div>
          {moreFromClub.map(ev => (
            <Link key={ev.id} href={`/event/${ev.id}`} className="flex items-center justify-between text-sm hover:text-gold">
              <span>{ev.name}</span>
              <span className="text-white/60"><LDate value={(ev as any).start_at} options={{ day: '2-digit', month: 'short' }} /></span>
            </Link>
          ))}
        </div>
      )}
      <div className="text-xs text-white/50">ID: {id}</div>
    </div>
  )
}

export const revalidate = 0
export const dynamic = 'force-dynamic'

