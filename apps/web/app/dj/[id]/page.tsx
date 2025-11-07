import Link from 'next/link'
import { fetchDj, fetchDjEvents, fetchSimilarDjs } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FavoriteButton } from '@/components/FavoriteButton'
import { LDate } from '@/components/LDate'
import { T } from '@/components/T'

export default async function DjProfile({ params }: { params: { id: string } }) {
  const dj = await fetchDj(params.id)
  if (!dj) return notFound()
  const events = await fetchDjEvents(params.id, 10)
  const similar = await fetchSimilarDjs(params.id, (dj as any).genres || [], 1)
  const images: string[] = Array.isArray((dj as any).images) ? (dj as any).images : []
  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] w-full rounded-xl bg-white/5 overflow-hidden">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt={(dj as any).name} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{(dj as any).name}</h1>
          <p className="muted">{(dj as any).bio || '-'}</p>
          {Array.isArray((dj as any).genres) && (dj as any).genres.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {(dj as any).genres.map((g: string) => (
                <span key={g} className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10">{g}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton eventId={params.id} targetType="dj" useLocalCache />
        </div>
      </div>
      <div className="card p-4">
        <div className="font-medium mb-2"><T k="dj.upcoming" /></div>
        <div className="space-y-2">
          {events.length === 0 && (
            <div className="text-sm text-white/60"><T k="dj.no_upcoming" /></div>
          )}
          {events.map(e => (
            <Link key={e.id} href={`/event/${e.id}`} className="flex items-center justify-between text-sm hover:text-gold">
              <span>{e.name}</span>
              <span className="text-white/60">
                <LDate value={(e as any).start_at} options={{ day: '2-digit', month: 'short' }} /> · {(e as any).club_name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      {similar && similar.length > 0 && (
        <div className="card p-4">
          <div className="font-medium mb-2">También te puede gustar</div>
          <div className="flex items-center justify-between text-sm">
            <Link href={`/dj/${(similar[0] as any).id}`} className="hover:text-gold flex items-center gap-3">
              {(Array.isArray((similar[0] as any).images) && (similar[0] as any).images[0]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(similar[0] as any).images[0]} alt={(similar[0] as any).name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
              ) : <div className="w-12 h-12 rounded-lg bg-white/5" />}
              <span className="font-medium">{(similar[0] as any).name}</span>
            </Link>
            <Link href={`/dj/${(similar[0] as any).id}`} className="btn btn-secondary px-3 py-1 text-sm">Ver</Link>
          </div>
        </div>
      )}
    </div>
  )
}


export const revalidate = 0
export const dynamic = 'force-dynamic'


