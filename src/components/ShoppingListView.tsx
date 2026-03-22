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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          {checkedCount} / {totalItems} items
        </p>
        <div className="h-2 w-40 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all"
            style={{ width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map(({ category, label, items }) => (
          <section key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              {label}
            </h2>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`mt-0.5 w-5 h-5 shrink-0 rounded border transition-colors ${
                      checked.has(item.id)
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {checked.has(item.id) && (
                      <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                    )}
                  </button>
                  <span className={`text-sm transition-colors ${checked.has(item.id) ? 'text-gray-600 line-through' : 'text-gray-200'}`}>
                    <span className="text-gray-400">{item.amount} {item.unit} </span>
                    {item.item}
                    {item.note && <span className="text-gray-500"> ({item.note})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
