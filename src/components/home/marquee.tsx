'use client';

import { useEffect, useState } from 'react';

const defaultItems = [
  'Same-day delivery',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Multan',
  'International orders welcome',
  'JazzCash',
  'EasyPaisa',
  'Cards accepted',
];

export function Marquee({ items }: { items?: string[] }) {
  const [apiItems, setApiItems] = useState<string[]>([]);

  useEffect(() => {
    if (items?.length) return;
    fetch('/api/admin/announcements')
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        if (!Array.isArray(rows)) return;
        const formatted = rows
          .filter((row: { isActive?: boolean }) => row.isActive)
          .sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((row: { text?: string }) => row.text || '')
          .filter(Boolean);
        if (formatted.length) setApiItems(formatted);
      })
      .catch(() => undefined);
  }, [items]);

  const safeItems = items && items.length ? items : apiItems.length ? apiItems : defaultItems;
  const content = safeItems.map((item, i) => (
    <span key={i} className="flex items-center gap-6">
      <span>{item}</span>
      <span className="text-[var(--gold)]/40" aria-hidden="true">
        &#9670;
      </span>
    </span>
  ));

  return (
    <div className="overflow-hidden border-y border-[var(--border)] bg-[var(--wine)] py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-6 font-accent text-[11px] uppercase tracking-[0.3em] text-[var(--gold)]">
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}
