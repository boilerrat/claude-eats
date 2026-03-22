'use client';

import { useState } from 'react';

type Pref = { id: string; ingredient: string; type: string };

interface Props {
  blocked: Pref[];
  preferred: Pref[];
}

export default function PreferencesView({ blocked: initBlocked, preferred: initPreferred }: Props) {
  const [blocked, setBlocked] = useState<Pref[]>(initBlocked);
  const [preferred, setPreferred] = useState<Pref[]>(initPreferred);
  const [input, setInput] = useState('');
  const [type, setType] = useState<'blocked' | 'preferred'>('blocked');
  const [loading, setLoading] = useState(false);

  async function add() {
    const ingredient = input.trim().toLowerCase();
    if (!ingredient) return;
    setLoading(true);
    const res = await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredient, type }),
    });
    if (res.ok) {
      const pref: Pref = await res.json();
      if (type === 'blocked') setBlocked(prev => [...prev, pref]);
      else setPreferred(prev => [...prev, pref]);
      setInput('');
    }
    setLoading(false);
  }

  async function remove(id: string, prefType: 'blocked' | 'preferred') {
    await fetch(`/api/preferences/${id}`, { method: 'DELETE' });
    if (prefType === 'blocked') setBlocked(prev => prev.filter(p => p.id !== id));
    else setPreferred(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Add ingredient</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. onions, peanuts, shellfish"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-sm text-text placeholder-subtle focus:outline-none focus:border-amber transition-colors"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value as 'blocked' | 'preferred')}
            className="px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-sm text-text focus:outline-none focus:border-amber transition-colors"
          >
            <option value="blocked">Never use</option>
            <option value="preferred">Preferred</option>
          </select>
          <button
            onClick={add}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber text-bg text-sm font-semibold transition-all hover:bg-amber-light active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Blocked */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-rose shrink-0" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Never use
          </h2>
        </div>
        {blocked.length === 0 ? (
          <p className="text-sm text-subtle italic font-display pl-4">None added yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {blocked.map(p => (
              <li
                key={p.id}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-rose/10 border border-rose/25 text-sm text-rose font-medium"
              >
                {p.ingredient}
                <button
                  onClick={() => remove(p.id, 'blocked')}
                  aria-label={`Remove ${p.ingredient}`}
                  className="w-4 h-4 flex items-center justify-center rounded-md hover:bg-rose/20 transition-colors text-rose/60 hover:text-rose"
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Preferred */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Preferred — favour these
          </h2>
        </div>
        {preferred.length === 0 ? (
          <p className="text-sm text-subtle italic font-display pl-4">None added yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {preferred.map(p => (
              <li
                key={p.id}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-sage/10 border border-sage/25 text-sm text-sage font-medium"
              >
                {p.ingredient}
                <button
                  onClick={() => remove(p.id, 'preferred')}
                  aria-label={`Remove ${p.ingredient}`}
                  className="w-4 h-4 flex items-center justify-center rounded-md hover:bg-sage/20 transition-colors text-sage/60 hover:text-sage"
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
