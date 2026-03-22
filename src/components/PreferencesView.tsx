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
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="e.g. onions"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value as 'blocked' | 'preferred')}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none"
        >
          <option value="blocked">Blocked</option>
          <option value="preferred">Preferred</option>
        </select>
        <button
          onClick={add}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Blocked */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
          Blocked — never use
        </h2>
        {blocked.length === 0 ? (
          <p className="text-sm text-gray-600">None yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {blocked.map(p => (
              <li key={p.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-800 text-sm text-red-300">
                {p.ingredient}
                <button
                  onClick={() => remove(p.id, 'blocked')}
                  className="text-red-500 hover:text-red-300 ml-1 leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Preferred */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">
          Preferred — favour these
        </h2>
        {preferred.length === 0 ? (
          <p className="text-sm text-gray-600">None yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {preferred.map(p => (
              <li key={p.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-950 border border-green-800 text-sm text-green-300">
                {p.ingredient}
                <button
                  onClick={() => remove(p.id, 'preferred')}
                  className="text-green-600 hover:text-green-300 ml-1 leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
