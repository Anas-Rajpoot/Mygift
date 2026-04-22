import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { WCProduct } from '@/types/woocommerce';

interface BestsellersProps {
  products: WCProduct[];
}

export function Bestsellers({ products }: BestsellersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
          Curated
        </span>
        <h2 className="mt-3 font-heading text-3xl font-light text-[var(--cream)] md:text-4xl">
          Bestselling Gifts
        </h2>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
          const hasImage = product.images && product.images.length > 0;
          const salePrice = product.sale_price
            ? parseFloat(product.sale_price)
            : null;
          const regularPrice = product.regular_price
            ? parseFloat(product.regular_price)
            : null;
          const displayPrice = product.price ? parseFloat(product.price) : 0;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group border border-[var(--border)] overflow-hidden transition-colors hover:border-[var(--border-hover)]"
            >
              {/* Image area */}
              <div className="relative aspect-[3/4] bg-[var(--surface-2)]">
                {hasImage ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-heading text-lg text-[var(--muted)]">
                      No image
                    </span>
                  </div>
                )}

                {/* Sale badge */}
                {product.on_sale && (
                  <span className="absolute left-3 top-3 bg-[var(--gold)] px-2 py-0.5 font-accent text-[10px] uppercase tracking-wider text-[var(--ink)]">
                    Sale
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="p-4">
                <h3 className="font-heading text-lg text-[var(--cream)] line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[var(--gold)]">
                    {formatPrice(displayPrice)}
                  </span>
                  {product.on_sale &&
                    salePrice !== null &&
                    regularPrice !== null &&
                    salePrice < regularPrice && (
                      <span className="text-sm text-[var(--muted)] line-through">
                        {formatPrice(regularPrice)}
                      </span>
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
