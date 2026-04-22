'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PackageCheck, Star, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { WCProduct } from '@/types/woocommerce'

interface QuickViewModalProps {
  open: boolean
  product: WCProduct | null
  onClose: () => void
  onAddToCart: (product: WCProduct, quantity: number, attributes?: Record<string, string>) => void
}

export function QuickViewModal({ open, product, onClose, onAddToCart }: QuickViewModalProps) {
  const router = useRouter()
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  const images = useMemo(() => product?.images ?? [], [product?.images])

  if (!product) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close modal"
            className="fixed inset-0 z-[90] bg-[rgba(15,6,8,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[100] w-full overflow-y-auto border-l border-[rgba(201,168,76,0.2)] bg-[#1a0c10] md:w-[560px]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 text-[rgba(201,168,76,0.6)] hover:text-cream"
            >
              <X size={20} />
            </button>
            <div className="space-y-6 p-10">
              <div className="relative aspect-[4/3] overflow-hidden border border-[rgba(201,168,76,0.12)]">
                {images[activeImage] ? (
                  <Image
                    src={images[activeImage].src}
                    alt={images[activeImage].alt || product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-surface" />
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, index) => (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-square overflow-hidden border ${
                        activeImage === index ? 'border-gold' : 'border-[rgba(201,168,76,0.15)]'
                      }`}
                    >
                      <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {product.categories.slice(0, 1).map((category) => (
                  <span key={category.id} className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-gold">
                    {category.name}
                  </span>
                ))}
                {product.on_sale && <span className="bg-rose px-2 py-0.5 font-cinzel text-[9px] text-white">Sale</span>}
                {product.featured && (
                  <span className="bg-[rgba(201,168,76,0.9)] px-2 py-0.5 font-cinzel text-[9px] text-ink">New</span>
                )}
              </div>

              <h2 className="font-lufga text-3xl font-light text-cream">{product.name}</h2>

              {product.rating_count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={index < Math.round(Number(product.average_rating || 0)) ? 'fill-gold text-gold' : 'text-muted'}
                      />
                    ))}
                  </div>
                  <span className="font-lufga text-xs text-muted">({product.rating_count} reviews)</span>
                </div>
              )}

              <p className="line-clamp-4 font-lufga text-sm font-light leading-7 text-muted">
                {product.short_description?.replace(/<[^>]*>/g, '') || 'No description available.'}
              </p>

              <div className="flex items-end gap-3">
                <span className="font-lufga text-3xl font-bold text-gold">
                  ₨{Number(product.price || 0).toLocaleString('en-PK')}
                </span>
                {product.on_sale && product.regular_price && (
                  <span className="font-lufga text-sm font-light text-muted line-through">
                    ₨{Number(product.regular_price).toLocaleString('en-PK')}
                  </span>
                )}
              </div>

              {product.attributes.filter((attr) => attr.options.length > 0).map((attr) => (
                <div key={attr.id} className="space-y-2">
                  <p className="font-lufga text-xs uppercase tracking-[0.2em] text-[rgba(201,168,76,0.65)]">{attr.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((option) => {
                      const selected = selectedAttributes[attr.name] === option
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attr.name]: option }))}
                          className={`border px-3 py-1.5 font-lufga text-xs ${
                            selected ? 'border-gold bg-gold text-ink' : 'border-[rgba(201,168,76,0.25)] text-cream'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="flex items-center border border-[rgba(201,168,76,0.2)]">
                <button type="button" className="h-10 w-10 text-cream" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <div className="flex-1 text-center font-lufga text-base font-semibold text-cream">{quantity}</div>
                <button type="button" className="h-10 w-10 text-cream" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full border border-gold bg-gold py-3 font-lufga text-xs font-semibold uppercase tracking-[0.2em] text-ink"
                  onClick={() => onAddToCart(product, quantity, selectedAttributes)}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="w-full border border-[rgba(201,168,76,0.35)] py-3 font-lufga text-xs font-medium uppercase tracking-[0.2em] text-cream"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  View Full Details
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <p className="font-lufga text-xs text-muted">Category: {product.categories[0]?.name ?? 'Uncategorized'}</p>
                <p className="flex items-center gap-1 font-lufga text-xs text-muted">
                  <PackageCheck size={12} className={product.stock_status === 'instock' ? 'text-green-500' : 'text-muted'} />
                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </p>
                <p className="font-lufga text-[11px] text-muted">SKU: {product.sku || 'N/A'}</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
