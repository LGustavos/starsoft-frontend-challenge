import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        color: '#ffffff',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 700 }}>404</h1>
      <p style={{ fontSize: '18px', color: '#cccccc' }}>Página não encontrada</p>
      <Link
        href="/"
        style={{
          backgroundColor: '#FF6E30',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
