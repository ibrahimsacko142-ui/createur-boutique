import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #fef2f2 100%)',
          color: '#1c1917',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {/* Logo */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f59e0b, #f97316, #ef4444)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 28,
              marginBottom: 24,
              boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
            }}
          >
            S
          </div>

          {/* 404 */}
          <h1
            style={{
              fontSize: 'clamp(5rem, 15vw, 10rem)',
              fontWeight: 900,
              lineHeight: 1,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            404
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#44403c',
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Page introuvable
          </p>

          <p
            style={{
              fontSize: '0.95rem',
              color: '#78716c',
              maxWidth: 400,
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Retournez à l&apos;accueil pour découvrir nos services.
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '12px 28px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            &#8592; Retour à l&apos;accueil
          </Link>

          <p
            style={{
              fontSize: '0.8rem',
              color: '#a8a29e',
              marginTop: 24,
            }}
          >
            Studio Créatif — Bamako, Mali
          </p>
        </div>
      </body>
    </html>
  )
}