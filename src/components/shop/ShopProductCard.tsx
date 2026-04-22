'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Heart, ShoppingCart } from 'lucide-react'
import type { WCProduct } from '@/types/woocommerce'
import { CATEGORY_STYLES } from '@/lib/categories'
import { useCartStore } from '@/stores/cart-store'
import { QuickViewModal } from './QuickViewModal'

interface ShopProductCardProps {
  product: WCProduct
  view: 'grid' | 'list'
}

function cleanDescription(text: string) {
  return text?.replace(/<[^>]*>/g, '').trim() || 'Premium handcrafted gift for your special moment.'
}

export function ShopProductCard({ product, view }: ShopProductCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const firstCategory = product.categories[0]
  const categorySlug = firstCategory?.slug as keyof typeof CATEGORY_STYLES | undefined
  const categoryColor = categorySlug ? CATEGORY_STYLES[categorySlug]?.color : undefined
  const description = cleanDescription(product.short_description)
  const image = product.images[0]
  const regularPrice = Number(product.regular_price || 0)
  const currentPrice = Number(product.price || 0)
  const savings = Math.max(0, regularPrice - currentPrice)

  const addToCart = (qty = 1, attributes?: Record<string, string>) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      regularPrice: regularPrice > 0 ? regularPrice : undefined,
      quantity: qty,
      image: image?.src,
      attributes,
      type: 'product',
    })
  }

  if (view === 'list') {
    return (
      <article className="flex border border-[rgba(201,168,76,0.1)] bg-[#1a0c10]">
        <div className="relative h-[140px] w-[200px] shrink-0 overflow-hidden">
          {image ? <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" /> : <div className="h-full w-full bg-surface" />}
        </div>
        <div className="flex flex-1 justify-between">
          <div className="flex-1 p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {firstCategory && (
                <span className="font-cinzel text-[8px] uppercase tracking-[0.2em]" style={{ color: categoryColor || '#c9a84c' }}>
                  {firstCategory.name}
                </span>
              )}
              {product.on_sale && <span className="bg-rose px-2 py-[2px] font-cinzel text-[8px] text-white">Sale</span>}
              {product.featured && (
                <span className="bg-[rgba(201,168,76,0.9)] px-2 py-[2px] font-cinzel text-[8px] text-ink">New</span>
              )}
            </div>
            <h3 className="mb-2 line-clamp-1 font-lufga text-xl font-semibold text-cream">{product.name}</h3>
            <p className="mb-4 line-clamp-2 font-lufga text-sm font-light text-muted">{description}</p>
          </div>
          <div className="flex w-[200px] shrink-0 flex-col justify-between border-l border-[rgba(201,168,76,0.08)] p-5">
            <div>
              <div className="font-lufga text-2xl font-bold text-gold">₨{currentPrice.toLocaleString('en-PK')}</div>
              {product.on_sale && regularPrice > currentPrice && (
                <div className="font-lufga text-sm font-light text-muted line-through">₨{regularPrice.toLocaleString('en-PK')}</div>
              )}
            </div>
            <button
              type="button"
              className="h-11 w-full border border-gold bg-gold font-lufga text-[11px] font-semibold uppercase tracking-[0.2em] text-ink"
              onClick={() => addToCart(1)}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <>
      <motion.article
        className="relative overflow-hidden border border-[rgba(201,168,76,0.1)] bg-[#1a0c10] transition-colors hover:border-[rgba(201,168,76,0.4)] hover:bg-[#1e1015]"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        variants={{ hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface">
              <ShoppingCart size={48} className="text-gold/50" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.on_sale && <span className="bg-rose px-2 py-1 font-cinzel text-[8px] text-white">Sale</span>}
            {product.featured && <span className="bg-[rgba(201,168,76,0.9)] px-2 py-1 font-cinzel text-[8px] text-ink">New</span>}
            {product.total_sales > 20 && <span className="bg-[rgba(90,170,122,0.85)] px-2 py-1 font-cinzel text-[8px] text-white">Best Seller</span>}
            {product.stock_status === 'outofstock' && (
              <span className="bg-[rgba(253,244,232,0.1)] px-2 py-1 font-cinzel text-[8px] text-muted">Out of Stock</span>
            )}
          </div>

          {product.stock_status === 'outofstock' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,6,8,0.6)]">
              <span className="font-lufga text-sm font-light text-muted">Out of Stock</span>
            </div>
          )}

          <AnimatePresence>
            {showActions && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center gap-2 bg-[rgba(201,168,76,0.08)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  type="button"
                  className="flex items-center gap-2 border border-[rgba(201,168,76,0.4)] bg-[rgba(15,6,8,0.85)] px-4 py-2 font-lufga text-[10px] font-medium uppercase tracking-[0.2em] text-cream"
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 8, opacity: 0 }}
                  onClick={() => setQuickViewOpen(true)}
                >
                  <Eye size={12} />
                  Quick View
                </motion.button>
                <motion.button
                  type="button"
                  className="flex h-[34px] w-[34px] items-center justify-center border border-[rgba(201,168,76,0.4)] bg-[rgba(15,6,8,0.85)] text-cream"
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 8, opacity: 0 }}
                >
                  <Heart size={14} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5">
          {firstCategory && (
            <div className="mb-2 font-cinzel text-[8px] uppercase tracking-[0.2em]" style={{ color: categoryColor || '#c9a84c' }}>
              {firstCategory.name}
            </div>
          )}

          <h3 className="mb-2 line-clamp-2 font-lufga text-base font-semibold text-cream hover:text-gold">{product.name}</h3>
          <p className="mb-4 line-clamp-1 font-lufga text-xs font-light text-[#8a7060]">{description}</p>

          <div className="flex items-end justify-between">
            <div>
              <div className="font-lufga text-xl font-bold text-gold">₨{currentPrice.toLocaleString('en-PK')}</div>
              {product.on_sale && regularPrice > currentPrice && (
                <>
                  <div className="font-lufga text-[13px] font-light text-[#8a7060] line-through">
                    ₨{regularPrice.toLocaleString('en-PK')}
                  </div>
                  <span className="font-lufga text-[10px] font-light text-rose">Save ₨{savings.toLocaleString('en-PK')}</span>
                </>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="flex h-9 w-9 items-center justify-center border border-[rgba(201,168,76,0.3)] text-gold transition-colors hover:bg-gold hover:text-ink"
              onClick={() => addToCart(1)}
            >
              <ShoppingCart size={14} />
            </motion.button>
          </div>
        </div>
      </motion.article>

      <QuickViewModal
        open={quickViewOpen}
        product={product}
        onClose={() => setQuickViewOpen(false)}
        onAddToCart={(p, qty, attributes) => {
          addToCart(qty, attributes)
          setQuickViewOpen(false)
        }}
      />
    </>
  )
}
