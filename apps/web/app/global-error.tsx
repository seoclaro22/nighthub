"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  if (typeof window !== 'undefined') console.error('Global error:', error)
  return (
    <html>
      <body style={{ color: 'white', background: '#0B0F14' }}>
        <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
          <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Se produjo un error</h2>
          <p style={{ opacity: 0.8, marginBottom: 12 }}>{error.message || 'Inténtalo de nuevo.'}</p>
          <button onClick={() => reset()} style={{ padding: '8px 12px', borderRadius: 8, background: '#D4AF37', color: '#000', fontWeight: 600 }}>Reintentar</button>
        </div>
      </body>
    </html>
  )
}

