export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#1e293b'
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        width: '100%', 
        textAlign: 'center', 
        padding: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 'bold', 
          color: '#4f46e5',
          margin: '0'
        }}>404</h1>
        <h2 style={{ 
          marginTop: '1.5rem', 
          fontSize: '1.875rem', 
          fontWeight: 'bold'
        }}>Page Not Found</h2>
        <p style={{ 
          marginTop: '0.5rem', 
          color: '#64748b' 
        }}>
          The page you are looking for does not exist.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
} 