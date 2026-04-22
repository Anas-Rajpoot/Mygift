'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import type { WCProduct } from '@/types/woocommerce';
import { formatPrice, calculateDiscount, getProductUrl } from '@/lib/utils';
import { QuickViewModal } from './quick-view-modal';

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const mainImage = product.images[0];
  const hoverImage = product.images[1];
  const hasDiscount = product.on_sale && product.regular_price && product.sale_price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={getProductUrl(product.slug)} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]">
          {mainImage ? (
            <>
              <Image
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={priority}
              />
              {hoverImage && (
                <Image
                  src={hoverImage.src}
                  alt={hoverImage.alt || product.name}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-[var(--muted)]" strokeWidth={1} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.on_sale && (
              <span className="bg-[var(--gold)] px-2 py-1 text-xs font-medium text-[var(--ink)] font-accent uppercase tracking-wider">
                -{discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="border border-[var(--gold)] px-2 py-1 text-xs font-medium text-[var(--gold)] font-accent uppercase tracking-wider">
                New
              </span>
            )}
          </div>

          {/* Quick View (opens product page). Visible on desktop/tablet without needing hover. */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute right-2 top-2 z-10 hidden sm:flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[11px] font-accent uppercase tracking-[0.18em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            aria-label={`Quick view: ${product.name}`}
          >
            Quick View
          </button>

          {/* Out of Stock Overlay */}
          {product.stock_status === 'outofstock' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink)]/80">
              <span className="text-sm font-medium text-[var(--muted)]">Out of Stock</span>
            </div>
          )}

          {/* Quick Add Button - Hidden on mobile */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block">
            <button
              type="button"
              className="w-full bg-[var(--gold)] py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--gold-light)] font-accent uppercase tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                // Navigate to product page for variant selection
                window.location.href = getProductUrl(product.slug);
              }}
            >
              {product.type === 'variable' ? 'Select Options' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-[var(--cream)] line-clamp-1">
            {product.name}
          </h3>

          {/* Categories */}
          {product.categories.length > 0 && (
            <p className="text-xs text-[var(--muted)]">
              {product.categories[0].name}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.on_sale ? (
              <>
                <span className="text-sm font-medium text-[var(--gold)]">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-sm text-[var(--muted)] line-through">
                  {formatPrice(product.regular_price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color Options Preview */}
          {product.type === 'variable' && product.attributes.length > 0 && (
            <div className="flex items-center gap-1 pt-1">
              {product.attributes
                .find((attr) => attr.name.toLowerCase() === 'color')
                ?.options.slice(0, 4)
                .map((color) => (
                  <span
                    key={color}
                    className="h-3 w-3 rounded-full border border-[var(--border)]"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              {(product.attributes.find((attr) => attr.name.toLowerCase() === 'color')?.options.length || 0) > 4 && (
                <span className="text-xs text-[var(--muted)]">
                  +{(product.attributes.find((attr) => attr.name.toLowerCase() === 'color')?.options.length || 0) - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Quick view popup */}
      <QuickViewModal
        open={isQuickViewOpen}
        product={product}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </motion.article>
  );
}
