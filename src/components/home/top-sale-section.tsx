'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WCProduct } from '@/types/woocommerce';
import { formatPrice, calculateDiscount, getProductUrl } from '@/lib/utils';

export function TopSaleSection({
  heading,
  subtitle,
  products,
  saleHref = '/shop?on_sale=true',
}: {
  heading: string;
  subtitle?: string;
  products: WCProduct[];
  saleHref?: string;
}) {
  if (!products || products.length === 0) return null;

  const main = products[0];
  const rest = products.slice(1, 4);

  const hasMainDiscount =
    main.on_sale && main.regular_price && main.sale_price;
  const mainDiscount = hasMainDiscount
    ? calculateDiscount(main.regular_price, main.sale_price)
    : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left header */}
          <div className="lg:col-span-4">
            <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
              Top Sale
            </span>
            <h2 className="mt-3 font-heading text-3xl font-light text-[var(--cream)] md:text-4xl">
              {heading}
            </h2>
            {subtitle && (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                {subtitle}
              </p>
            )}

            <div className="mt-6">
              <Link
                href={saleHref}
                className="inline-flex items-center rounded-xl bg-[var(--gold)] px-6 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)]"
              >
                Shop Sale
              </Link>
            </div>
          </div>

          {/* Right grid */}
          <div className="lg:col-span-8">
            <div className="grid gap-4 lg:grid-cols-12">
              {/* Main product */}
              <Link
                href={getProductUrl(main.slug)}
                className="lg:col-span-7 group"
              >
                <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--ink)] lg:min-h-[560px]">
                  {main.images?.[0]?.src ? (
                    <Image
                      src={main.images[0].src}
                      alt={main.images[0].alt || main.name}
                      fill
                      className="object-cover opacity-[0.85] transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      priority
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Discount badge */}
                  {mainDiscount > 0 && (
                    <div className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-accent uppercase tracking-[0.12em] text-[var(--ink)]">
                      -{mainDiscount}%
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-heading text-xl font-light text-white">
                      {main.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-3">
                      {main.on_sale ? (
                        <>
                          <span className="text-lg font-medium text-[var(--gold)]">
                            {formatPrice(main.sale_price)}
                          </span>
                          <span className="text-sm text-white/70 line-through">
                            {formatPrice(main.regular_price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-medium text-white">
                          {formatPrice(main.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Side products */}
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                {rest.map((p) => {
                  const discount =
                    p.on_sale && p.regular_price && p.sale_price
                      ? calculateDiscount(p.regular_price, p.sale_price)
                      : 0;

                  return (
                    <Link key={p.id} href={getProductUrl(p.slug)} className="group">
                      <div className="relative min-h-[170px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--ink)]">
                        {p.images?.[0]?.src ? (
                          <Image
                            src={p.images[0].src}
                            alt={p.images[0].alt || p.name}
                            fill
                            className="object-cover opacity-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
                            sizes="(min-width: 1024px) 22vw, 100vw"
                          />
                        ) : null}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                        {discount > 0 && (
                          <div className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-accent uppercase tracking-[0.12em] text-[var(--ink)]">
                            -{discount}%
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="line-clamp-1 font-heading text-[15px] font-light text-white">
                            {p.name}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {p.on_sale ? (
                              <>
                                <span className="text-[14px] font-medium text-[var(--gold)]">
                                  {formatPrice(p.sale_price)}
                                </span>
                                <span className="text-[12px] text-white/70 line-through">
                                  {formatPrice(p.regular_price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-[14px] font-medium text-white">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

