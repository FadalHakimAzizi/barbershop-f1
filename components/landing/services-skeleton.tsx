export default function ServicesSkeleton() {
  return (
    <section
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* heading skeleton */}
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 50px' }}>
          <div className="skeleton" style={{ height: 14, width: 110, margin: '0 auto 16px' }} />
          <div className="skeleton" style={{ height: 42, width: '65%', margin: '0 auto 14px' }} />
          <div className="skeleton" style={{ height: 18, width: '78%', margin: '0 auto' }} />
        </div>

        {/* card skeletons */}
        <div className="grid-cards">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-card)',
                overflow: 'hidden',
              }}
            >
              <div className="skeleton" style={{ height: 184, borderRadius: 0 }} />
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="skeleton" style={{ height: 22, width: '58%' }} />
                <div className="skeleton" style={{ height: 13, width: '100%' }} />
                <div className="skeleton" style={{ height: 13, width: '75%' }} />
                <div className="skeleton" style={{ height: 13, width: '45%', marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA skeleton */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div className="skeleton" style={{ height: 48, width: 240, margin: '0 auto', borderRadius: 'var(--r-btn)' }} />
        </div>
      </div>
    </section>
  )
}
