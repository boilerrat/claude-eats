'use client';

import { useState } from 'react';

type ShoppingItem = {
  id: string;
  item: string;
  amount: string;
  unit: string;
  note: string | null;
  checked: boolean;
};

type Group = {
  category: string;
  label: string;
  items: ShoppingItem[];
};

interface Props {
  planId: string;
  grouped: Group[];
}

const CATEGORY_ICONS: Record<string, string> = {
  proteins: '🥩',
  produce: '🥦',
  dairy: '🧀',
  pantry: '🫙',
  spices: '🌿',
};

export default function ShoppingListView({ planId, grouped }: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const g of grouped) {
      for (const item of g.items) {
        if (item.checked) initial.add(item.id);
      }
    }
    return initial;
  });

  async function toggle(id: string) {
    const nowChecked = !checked.has(id);
    setChecked(prev => {
      const next = new Set(prev);
      nowChecked ? next.add(id) : next.delete(id);
      return next;
    });
    await fetch('/api/shopping/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, checked: nowChecked }),
    });
  }

  const totalItems = grouped.reduce((n, g) => n + g.items.length, 0);
  const checkedCount = checked.size;
  const pct = totalItems ? (checkedCount / totalItems) * 100 : 0;
  const done = checkedCount === totalItems && totalItems > 0;

  return (
    <div>
      {/* Progress header */}
      <div className="mb-8 p-4 rounded-2xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text">
            {done ? '✓ All done!' : `${checkedCount} of ${totalItems} items`}
          </span>
          <span className="text-xs text-subtle font-medium tabular-nums">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-sage' : 'bg-amber'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-8">
        {grouped.map(({ category, label, items }) => {
          const allChecked = items.every(i => checked.has(i.id));
          return (
            <section key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base leading-none" aria-hidden>{CATEGORY_ICONS[category] ?? '•'}</span>
                <h2 className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                  allChecked ? 'text-subtle line-through' : 'text-muted'
                }`}>
                  {label}
                </h2>
              </div>
              <ul className="space-y-1">
                {items.map(item => {
                  const isChecked = checked.has(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group ${
                          isChecked
                            ? 'bg-surface/60 hover:bg-surface'
                            : 'hover:bg-surface'
                        }`}
                      >
                        {/* Checkbox */}
                        <span
                          className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                            isChecked
                              ? 'bg-amber border-amber'
                              : 'border-border-bright group-hover:border-muted'
                          }`}
                        >
                          {isChecked && (
                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                              <path d="M2 6l3 3 5-5" stroke="#0E0C0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>

                        {/* Item text */}
                        <span className={`flex-1 text-sm leading-relaxed transition-colors ${
                          isChecked ? 'text-subtle line-through' : 'text-text'
                        }`}>
                          <span className={`font-medium ${isChecked ? '' : 'text-muted'}`}>
                            {item.amount} {item.unit}{' '}
                          </span>
                          {item.item}
                          {item.note && (
                            <span className="text-subtle"> — {item.note}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
