'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, anthropicApiKey: apiKey }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Setup failed');
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
          <h1 className="font-display italic text-2xl text-text mb-1">First-time setup</h1>
          <p className="text-subtle text-sm mb-6">
            Set a password and paste your Anthropic API key to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">
                Password <span className="text-subtle">(min 8 chars)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                autoFocus
                required
                minLength={8}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-medium text-muted mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-xs font-medium text-muted mb-1.5">
                Anthropic API key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                autoComplete="off"
                required
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle font-mono focus:outline-none focus:border-amber/60 transition-colors"
                placeholder="sk-ant-..."
              />
              <p className="text-subtle text-[11px] mt-1.5">
                Get yours at console.anthropic.com
              </p>
            </div>

            {error && (
              <p className="text-rose text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirm || !apiKey}
              className="w-full bg-amber/90 hover:bg-amber text-bg font-semibold text-sm rounded-xl py-2.5 transition-colors disabled:opacity-40"
            >
              {loading ? 'Setting up…' : 'Get started'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
