import Link from 'next/link'

interface LogoProps {
  size?: number
  light?: boolean
  href?: string
}

export default function Logo({ size = 40, light, href = '/' }: LogoProps) {
  const emblemSize = size
  const fontSize = Math.round(size * 0.46)
  const subSize = Math.round(size * 0.2)
  const emblFontSize = Math.round(size * 0.42)

  const content = (
    <div className="flex items-center gap-3">
      <div
        style={{
          width: emblemSize,
          height: emblemSize,
          borderRadius: '999px',
          background: 'var(--accent)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 16px color-mix(in oklab, var(--accent) 40%, transparent)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: emblFontSize,
            color: 'var(--accent-ink)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          FI
        </span>
      </div>
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: light ? '#fff' : 'var(--text)',
            whiteSpace: 'nowrap',
          }}
        >
          FI Barbershop
        </div>
        <div
          style={{
            fontSize: subSize,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginTop: 3,
            fontWeight: 600,
          }}
        >
          Sharp · Clean · Classic
        </div>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
