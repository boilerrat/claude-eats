'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  planDays: string[];
  apiKeySet: boolean;
}

export default function SettingsView({ planDays: initialDays, apiKeySet }: Props) {
  const router = useRouter();

  // Plan days
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [daysLoading, setDaysLoading] = useState(false);
  const [daysMsg, setDaysMsg] = useState('');

  // API key
  const [newApiKey, setNewApiKey] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [apiKeyMsg, setApiKeyMsg] = useState('');

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    setDaysMsg('');
  }

  async function saveDays(e: FormEvent) {
    e.preventDefault();
    if (selectedDays.length === 0) return;
    setDaysLoading(true);
    setDaysMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planDays: ALL_DAYS.filter(d => selectedDays.includes(d)) }),
      });
      if (res.ok) {
        setDaysMsg('Saved');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setDaysMsg(data.error ?? 'Failed to save');
      }
    } catch {
      setDaysMsg('Something went wrong');
    } finally {
      setDaysLoading(false);
    }
  }

  async function saveApiKey(e: FormEvent) {
    e.preventDefault();
    setApiKeyLoading(true);
    setApiKeyMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anthropicApiKey: newApiKey }),
      });
      if (res.ok) {
        setApiKeyMsg('API key updated');
        setNewApiKey('');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setApiKeyMsg(data.error ?? 'Failed to update');
      }
    } catch {
      setApiKeyMsg('Something went wrong');
    } finally {
      setApiKeyLoading(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwMsg('Passwords do not match');
      return;
    }
    setPwLoading(true);
    setPwMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      if (res.ok) {
        setPwMsg('Password changed');
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      } else {
        const data = await res.json().catch(() => ({}));
        setPwMsg(data.error ?? 'Failed to change password');
      }
    } catch {
      setPwMsg('Something went wrong');
    } finally {
      setPwLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="space-y-8">

      {/* Planning days */}
      <section className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-display italic text-lg text-text mb-1">Planning days</h2>
        <p className="text-subtle text-xs mb-5">Choose which days Claude plans meals for.</p>
        <form onSubmit={saveDays}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {ALL_DAYS.map(day => (
              <label
                key={day}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm select-none ${
                  selectedDays.includes(day)
                    ? 'border-amber/50 bg-amber/10 text-amber'
                    : 'border-border text-muted hover:border-border-bright'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                  selectedDays.includes(day)
                    ? 'border-amber bg-amber/20'
                    : 'border-border'
                }`}>
                  {selectedDays.includes(day) && (
                    <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 text-amber">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={daysLoading || selectedDays.length === 0}
              className="px-4 py-2 bg-amber/90 hover:bg-amber text-bg text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
            >
              {daysLoading ? 'Saving…' : 'Save days'}
            </button>
            {daysMsg && (
              <span className={`text-xs ${daysMsg === 'Saved' ? 'text-sage' : 'text-rose'}`}>
                {daysMsg}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* API key */}
      <section className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-display italic text-lg text-text mb-1">Anthropic API key</h2>
        <p className="text-subtle text-xs mb-1">
          {apiKeySet ? 'A key is currently set. Paste a new one to replace it.' : 'No key set — generation will fail.'}
        </p>
        <form onSubmit={saveApiKey} className="space-y-3 mt-4">
          <input
            type="password"
            value={newApiKey}
            onChange={e => setNewApiKey(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle font-mono focus:outline-none focus:border-amber/60 transition-colors"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={apiKeyLoading || !newApiKey.startsWith('sk-')}
              className="px-4 py-2 bg-amber/90 hover:bg-amber text-bg text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
            >
              {apiKeyLoading ? 'Saving…' : 'Update key'}
            </button>
            {apiKeyMsg && (
              <span className={`text-xs ${apiKeyMsg.includes('updated') ? 'text-sage' : 'text-rose'}`}>
                {apiKeyMsg}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-display italic text-lg text-text mb-1">Change password</h2>
        <form onSubmit={savePassword} className="space-y-3 mt-4">
          <input
            type="password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
            required
            className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
          />
          <input
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            placeholder="New password (min 8 chars)"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-subtle focus:outline-none focus:border-amber/60 transition-colors"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pwLoading || !currentPw || !newPw || !confirmPw}
              className="px-4 py-2 bg-amber/90 hover:bg-amber text-bg text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
            >
              {pwLoading ? 'Changing…' : 'Change password'}
            </button>
            {pwMsg && (
              <span className={`text-xs ${pwMsg === 'Password changed' ? 'text-sage' : 'text-rose'}`}>
                {pwMsg}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Logout */}
      <section className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-display italic text-lg text-text mb-1">Session</h2>
        <p className="text-subtle text-xs mb-4">Sessions last 30 days.</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-rose/40 text-rose hover:bg-rose/10 text-sm font-medium rounded-xl transition-colors"
        >
          Sign out
        </button>
      </section>

    </div>
  );
}
