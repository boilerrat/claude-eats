'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Incorrect password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7 text-amber" aria-hidden>
            <path d="M7 3v5a3 3 0 003 3v10a1 1 0 002 0V11a3 3 0 003-3V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M18 3v18a1 1 0 002 0V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M18 3v7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25"/>
          </svg>
          <span className="font-display italic text-amber text-2xl tracking-tight leading-none">
            claude·eats
          </span>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8">
          <h1 className="font-display italic text-2xl text-text mb-1">Welcome back</h1>
          <p className="text-subtle text-sm mb-6">Enter your password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-rose text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-amber/90 hover:bg-amber text-bg font-semibold text-sm rounded-xl py-2.5 transition-colors disabled:opacity-40"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
