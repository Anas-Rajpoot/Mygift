import Link from 'next/link';
import Image from 'next/image';
import { Gift, Shirt, Watch, Download, Flower2 } from 'lucide-react';
import { wooCommerce } from '@/lib/woocommerce';

const ICONS = [Gift, Shirt, Watch, Download, Flower2];

export async function CategoryShowcase({ categoryLinkTemplate = '/shop?category={slug}' }: { categoryLinkTemplate?: string }) {
  const categories = await wooCommerce.categories.list({ per_page: 20, hide_empty: false });
  const topLevel = categories.filter((cat) => cat.parent === 0).slice(0, 5);

  if (topLevel.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
          Collections
        </span>
        <h2 className="mt-3 font-heading text-3xl font-light text-[var(--cream)] md:text-4xl">
          Explore Our World
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {topLevel.map((cat, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={cat.name}
            >
              <Link
                href={categoryLinkTemplate.replace('{slug}', encodeURIComponent(cat.slug))}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1">
                  {/* Top: image/icon */}
                  {cat.image?.src ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={cat.image.src}
                        alt={cat.image.alt || cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        sizes="(min-width: 1024px) 20vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/25 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[var(--surface-2)]">
                      <Icon size={36} className="text-[var(--gold)]" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Bottom: label + count (kept in normal flow so it never overlaps/breaks layout) */}
                  <div className="px-5 pb-6 pt-5 text-center">
                    <p className="font-heading text-lg text-[var(--cream)]">{cat.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{cat.count} items</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
