export default function RootLoading() {
  // Lightweight skeleton to improve perceived performance
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-white/10 rounded" />
      <div className="h-10 bg-white/5 rounded" />
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/10" />
        ))}
      </div>
    </div>
  )
}

