'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { WCProduct } from '@/types/woocommerce';
import { formatPrice, calculateDiscount, getProductUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

interface QuickViewModalProps {
  open: boolean;
  product: WCProduct;
  onClose: () => void;
}

export function QuickViewModal({ open, product, onClose }: QuickViewModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addItem, openCart } = useCartStore();

  const images = useMemo(() => {
    const list = product.images ?? [];
    return list.length ? list : [];
  }, [product.images]);

  const mainImage = images[activeIndex] ?? images[0];

  const hasDiscount = product.on_sale && product.regular_price && product.sale_price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close quick view"
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            initial={{ y: 14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-accent text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
                  Quick View
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="max-h-[85vh] overflow-auto">
              <div className="grid gap-5 p-5 lg:grid-cols-5">
              {/* Gallery */}
              <div className="lg:col-span-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--ink)]">
                  {mainImage?.src ? (
                    <Image
                      src={mainImage.src}
                      alt={mainImage.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority
                    />
                  ) : null}

                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <div className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-accent uppercase tracking-[0.12em] text-[var(--ink)]">
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={`${img.src}-${idx}`}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`relative overflow-hidden rounded-lg border transition-colors ${
                          idx === activeIndex
                            ? 'border-[var(--gold)]'
                            : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <span className="sr-only">{img.alt || product.name}</span>
                        {img.src ? (
                          <Image
                            src={img.src}
                            alt={img.alt || product.name}
                            width={160}
                            height={120}
                            className="h-20 w-full object-cover"
                          />
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="lg:col-span-2">
                <div className="flex h-full flex-col gap-3">
                  <h2 className="font-heading text-2xl font-light text-[var(--cream)]">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    {product.on_sale ? (
                      <>
                        <span className="text-xl font-medium text-[var(--gold)]">
                          {formatPrice(product.sale_price)}
                        </span>
                        <span className="text-base text-[var(--muted)] line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-medium text-[var(--cream)]">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {product.categories?.[0]?.name && (
                    <p className="text-sm text-[var(--muted)]">
                      Category:{' '}
                      <span className="text-[var(--cream)]">{product.categories[0].name}</span>
                    </p>
                  )}

                  <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-sm leading-relaxed text-[var(--muted)]">
                      {product.short_description
                        ? product.short_description.replace(/<[^>]*>/g, '').slice(0, 130) + '...'
                        : 'Premium selection — order today and enjoy fast delivery.'}
                    </p>
                  </div>

                  {/* Primary CTA */}
                  {product.type === 'variable' ? (
                    <Link
                      href={getProductUrl(product.slug)}
                      className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[var(--gold)] px-5 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)]"
                      onClick={onClose}
                    >
                      Select Options
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[var(--gold)] px-5 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)] disabled:opacity-40"
                      disabled={product.stock_status === 'outofstock'}
                      onClick={() => {
                        const price = parseFloat(product.price);
                        if (isNaN(price)) return;

                        addItem({
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price,
                          regularPrice: product.regular_price
                            ? parseFloat(product.regular_price)
                            : undefined,
                          quantity: 1,
                          image: product.images?.[0]?.src || '',
                          maxQuantity: product.stock_quantity || undefined,
                        });
                        openCart();
                        onClose();
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

