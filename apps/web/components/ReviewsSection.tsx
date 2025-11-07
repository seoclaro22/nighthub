import { getSupabaseClient } from '@/lib/supabase'
import { Suspense } from 'react'
import { WriteReview } from './WriteReview'
import { T } from './T'
import { LDate } from './LDate'
import { ReviewRow } from './ReviewRow'

export async function ReviewsSection({ targetType = 'event', targetId }: { targetType?: 'event'|'club'; targetId: string }) {
  return (
    <div className="space-y-3 mt-4">
      <div className="font-medium"><T k="reviews.title" /></div>
      <Suspense fallback={<div className="muted"><T k="loading" /></div>}>
        <ReviewsList targetType={targetType} targetId={targetId} />
      </Suspense>
      <WriteReview targetType={targetType} targetId={targetId} />
    </div>
  )
}

async function ReviewsList({ targetType, targetId }: { targetType: 'event'|'club'; targetId: string }) {
  const sb = getSupabaseClient()
  const { data } = await sb
    .from('reviews')
    .select('id,text,created_at,user_id')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('status','approved')
    .order('created_at', { ascending: false })
  if (!data || data.length === 0) return <div className="muted"><T k="reviews.empty" /></div>
  return (
    <div className="grid gap-2">
      {data.map((r:any) => (
        <ReviewRow key={r.id} r={r} />
      ))}
    </div>
  )
}
