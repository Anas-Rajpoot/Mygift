'use client';

import { useRef } from 'react';
import type { WCProduct } from '@/types/woocommerce';
import { ProductCard } from '@/components/product/product-card';

export function ProductCarousel({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: WCProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(260, Math.round(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
            {title}
          </span>
          {subtitle && (
            <h2 className="mt-3 font-heading text-3xl font-light text-[var(--cream)] md:text-4xl">
              {subtitle}
            </h2>
          )}
        </div>

        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            className="rounded-full border border-[var(--border)] px-3 py-2 text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            className="rounded-full border border-[var(--border)] px-3 py-2 text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((p, idx) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-[210px] sm:w-[240px] md:w-[270px] lg:w-[240px]"
          >
            <ProductCard product={p} priority={idx < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}

