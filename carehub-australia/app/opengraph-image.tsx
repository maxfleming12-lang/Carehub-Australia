import { ImageResponse } from 'next/og'

export const alt =
  'Scribe & Thrive Australia — Professional Care Management Platform'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Default social-share card for every page (og:image / twitter:image).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #111827 0%, #134e4a 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              fontWeight: 700,
            }}
          >
            S&amp;T
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '40px', fontWeight: 700 }}>
              Scribe &amp; Thrive
            </div>
            <div style={{ fontSize: '24px', color: '#5eead4' }}>Australia</div>
          </div>
        </div>
        <div
          style={{
            fontSize: '58px',
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: '950px',
            marginBottom: '28px',
          }}
        >
          Professional tools for Australia&apos;s care community
        </div>
        <div style={{ fontSize: '28px', color: '#d1d5db', maxWidth: '900px' }}>
          AI documentation, training courses, and resources for NDIS and aged
          care professionals
        </div>
      </div>
    ),
    size
  )
}
