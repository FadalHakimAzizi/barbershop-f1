export default function RecommendSkeleton() {
  return (
    <section>
      <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* header skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 50,
          }}
        >
          <div>
            <div className="skeleton" style={{ height: 14, width: 120, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 42, width: 300, marginBottom: 14 }} />
            <div className="skeleton" style={{ height: 16, width: 380 }} />
          </div>
          <div className="skeleton" style={{ height: 28, width: 160, borderRadius: 'var(--r-pill)' }} />
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
                <div className="skeleton" style={{ height: 13, width: '70%' }} />
                <div className="skeleton" style={{ height: 13, width: '40%', marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
