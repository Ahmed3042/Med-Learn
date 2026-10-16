import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('ahmed@medlearn.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Left Panel — Branding */}
      <div className="login-panel login-panel--brand" aria-hidden="true">
        <div className="login-brand">
          <div className="login-brand__logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
              <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.15" />
              <path d="M24 10v28M10 24h28" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="login-brand__name">Med-Learn</h1>
          <p className="login-brand__tagline">Medical Education Platform</p>
        </div>

        <div className="login-features">
          {[
            { icon: '📚', text: 'Structured medical courses' },
            { icon: '🎬', text: 'Video lectures by expert faculty' },
            { icon: '📄', text: 'Curriculum study documents' },
            { icon: '📊', text: 'Track your learning progress' },
          ].map(f => (
            <div key={f.text} className="login-feature">
              <span className="login-feature__icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <p className="login-panel__faculty">Faculty of Medicine · Year 1</p>
      </div>

      {/* Right Panel — Form */}
      <div className="login-panel login-panel--form">
        <div className="login-form-wrap animate-fade-in">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue your medical education journey.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                ref={emailRef}
                autoComplete="email"
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary login-submit"
              disabled={loading}
            >
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</> : 'Sign in'}
            </button>

            <div className="login-demo-hint">
              <strong>Demo credentials (local only):</strong> ahmed@medlearn.com / demo1234
              <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.85 }}>
                Simulated local session · No external authentication service connected
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
