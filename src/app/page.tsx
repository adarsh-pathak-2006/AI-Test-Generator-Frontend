import Link from 'next/link';

export default function Home() {
  return (
    <div className="layout-container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', textAlign: 'center' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Generate Quizzes with <span className="text-gradient">AI</span>
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: '#94a3b8' }}>
          Transform any document, text, or study material into an interactive multiple-choice quiz in seconds. Empower your learning with the power of artificial intelligence.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Get Started Free
          </Link>
          <Link href="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Login to Account
          </Link>
        </div>
      </div>
      
      <div className="glass glass-card animate-fade-in" style={{ marginTop: '5rem', display: 'flex', gap: '2rem', textAlign: 'left', animationDelay: '0.2s', opacity: 0 }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>1. Upload</h3>
          <p style={{ fontSize: '0.875rem' }}>Paste your notes, articles, or any text you want to learn.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--secondary)' }}>2. Generate</h3>
          <p style={{ fontSize: '0.875rem' }}>Our AI automatically analyzes and extracts key concepts.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>3. Test</h3>
          <p style={{ fontSize: '0.875rem' }}>Take the interactive quiz and track your knowledge score.</p>
        </div>
      </div>
    </div>
  );
}
