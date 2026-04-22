'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Plus, Sparkles } from 'lucide-react'
import { fetchAllCategories, fetchProductsByCategory } from '@/app/actions/products'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { GiftLabSidebar } from '@/components/giftlab/sidebar'
import { useGiftLabStore, type GiftLabProduct } from '@/stores/giftlabStore'

interface WcCategory {
  id: number
  name: string
  slug: string
}

export default function GiftLabStep3Page() {
  const router = useRouter()
  const box = useGiftLabStore((s) => s.box)
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const addItem = useGiftLabStore((s) => s.addItem)
  const removeItem = useGiftLabStore((s) => s.removeItem)
  const isItemSelected = useGiftLabStore((s) => s.isItemSelected)
  const setStep = useGiftLabStore((s) => s.setStep)
  const total = useGiftLabStore((s) => s.getLiveTotal())

  const [activeCategory, setActiveCategory] = useState('all')
  const [categories, setCategories] = useState<WcCategory[]>([])
  const [allProducts, setAllProducts] = useState<GiftLabProduct[]>([])
  const [products, setProducts] = useState<GiftLabProduct[]>([])
  const [loading, setLoading] = useState(true)
  const cardRefs = useRef<Record<number, HTMLElement | null>>({})

  const atCapacity = !!box && selectedItems.length >= box.maxItems

  useEffect(() => {
    setStep(3)
  }, [setStep])

  useEffect(() => {
    const load = async () => {
      const [allCats, allProducts] = await Promise.all([fetchAllCategories(), fetchProductsByCategory('all')])
      const fallbackCategories: WcCategory[] = Array.from(
        new Map(
          (allProducts ?? [])
            .flatMap((product) => product.categories ?? [])
            .map((category) => [category.id, { id: category.id, name: category.name, slug: category.slug }]),
        ).values(),
      )
      setCategories((allCats?.length ? allCats : fallbackCategories) as WcCategory[])
      setAllProducts(allProducts)
      setProducts(allProducts)
      setLoading(false)
    }
    load()
  }, [])

  const onSelectCategory = async (slug: string) => {
    setActiveCategory(slug)
    if (slug === 'all') {
      setProducts(allProducts)
      return
    }
    const filtered = allProducts.filter((product) =>
      (product.categories ?? []).some((category) => category.slug === slug),
    )
    setProducts(filtered)
  }

  const runFlyAnimation = (product: GiftLabProduct) => {
    const cardRect = cardRefs.current[product.id]?.getBoundingClientRect()
    const targetRect = document.getElementById('giftlab-sidebar-thumb-target')?.getBoundingClientRect()
    const src = product.images?.[0]?.src
    if (!cardRect || !targetRect || !src) return addItem(product)

    const clone = document.createElement('div')
    clone.style.position = 'fixed'
    clone.style.left = `${cardRect.x}px`
    clone.style.top = `${cardRect.y}px`
    clone.style.width = '60px'
    clone.style.height = '60px'
    clone.style.backgroundImage = `url(${src})`
    clone.style.backgroundSize = 'cover'
    clone.style.backgroundPosition = 'center'
    clone.style.borderRadius = '4px'
    clone.style.zIndex = '9999'
    document.body.appendChild(clone)

    clone.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
        {
          transform: `translate(${targetRect.x - cardRect.x}px, ${targetRect.y - cardRect.y}px) scale(0.3)`,
          opacity: 0,
        },
      ],
      { duration: 500, easing: 'cubic-bezier(0.16,1,0.3,1)' },
    ).onfinish = () => {
      clone.remove()
      addItem(product)
    }
  }

  return (
    <div className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-24 pt-8 text-[#fdf4e8] lg:-mt-[104px]">
      <GiftLabProgressBar />
      <div className="mx-auto mt-10 max-w-7xl lg:flex lg:gap-8">
        <section className="flex-1">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => onSelectCategory('all')}
              className={`shrink-0 border px-4 py-2 text-sm ${activeCategory === 'all' ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0f0608]' : 'border-[#c9a84c]/30 text-[#fdf4e8]'}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.slug)}
                className={`shrink-0 border px-4 py-2 text-sm ${activeCategory === category.slug ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0f0608]' : 'border-[#c9a84c]/30 text-[#fdf4e8]'}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse border border-[#c9a84c]/20 p-3">
                  <div className="aspect-square bg-[#1b0d11]" />
                  <div className="mt-3 h-4 bg-[#1b0d11]" />
                </div>
              ))}
            {!loading &&
              products.map((product, index) => {
                const selected = isItemSelected(product.id)
                const disabled = atCapacity && !selected
                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    ref={(node) => {
                      cardRefs.current[product.id] = node
                    }}
                    className={`relative border p-3 ${selected ? 'border-[#c9a84c] bg-[#c9a84c]/5' : 'border-[#c9a84c]/20'} ${disabled ? 'pointer-events-none cursor-not-allowed opacity-35' : ''}`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 rounded-full bg-[#c9a84c] p-1 text-[#0f0608]">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div className="group relative aspect-square overflow-hidden bg-[#150a0e]">
                      {product.images?.[0]?.src ? (
                        <Image src={product.images[0].src} fill alt={product.name} className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles className="h-8 w-8 text-[#c9a84c]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#c9a84c]/15 opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <p className="mt-3 line-clamp-2 font-lufga text-sm">{product.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-lufga text-base font-bold text-[#c9a84c]">Rs {Number(product.price).toLocaleString('en-PK')}</p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => (selected ? removeItem(product.id) : runFlyAnimation(product))}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${selected ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0f0608]' : 'border-[#c9a84c] text-[#c9a84c]'}`}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
                      </motion.button>
                    </div>
                  </motion.article>
                )
              })}
            {!loading && products.length === 0 && (
              <div className="col-span-full border border-[#c9a84c]/20 p-8 text-center">
                <p className="font-lufga text-lg text-[#fdf4e8]">No products found</p>
                <p className="mt-2 font-lufga text-sm text-[#8a7060]">
                  Check WooCommerce credentials/categories or try a different tab.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 hidden lg:block">
          <GiftLabSidebar
            onContinue={() => {
              setStep(4)
              router.push('/giftlab/step-4')
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#c9a84c]/20 bg-[#12090b] p-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-lufga text-sm">
            {selectedItems.length} items · Rs {Number(total).toLocaleString('en-PK')} · Continue →
          </p>
          <button
            onClick={() => {
              setStep(4)
              router.push('/giftlab/step-4')
            }}
            className="bg-[#c9a84c] px-4 py-2 text-xs font-semibold text-[#0f0608]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
