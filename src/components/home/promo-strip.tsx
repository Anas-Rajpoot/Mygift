'use client';

import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export function PromoStrip({ items }: { items?: string[] }) {
  const labels = items && items.length ? items : ['Same-day delivery', 'Easy returns', 'Secure checkout'];
  const [l1, l2, l3] = labels;
  return (
    <div className="mx-auto w-full max-w-3xl px-2">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-[var(--gold)]" />
          <span className="font-accent text-[10px] uppercase tracking-[0.25em] text-[var(--cream)]">
            {l1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-[var(--gold)]" />
          <span className="font-accent text-[10px] uppercase tracking-[0.25em] text-[var(--cream)]">
            {l2}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[var(--gold)]" />
          <span className="font-accent text-[10px] uppercase tracking-[0.25em] text-[var(--cream)]">
            {l3}
          </span>
        </div>
      </div>
    </div>
  );
}

