'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Package, Search, Sparkles, Star, Tag, X } from 'lucide-react'
import type { WCCategory } from '@/types/woocommerce'
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider'

type SortValue = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'oldest'

const OCCASIONS = [
  { label: 'Birthday', slug: 'birthday' },
  { label: 'Anniversary', slug: 'anniversary' },
  { label: 'Eid', slug: 'eid' },
  { label: 'Wedding', slug: 'wedding' },
  { label: "Mother's Day", slug: 'mothers-day' },
  { label: "Valentine's Day", slug: 'valentines-day' },
]

interface ShopFiltersProps {
  categories: WCCategory[]
  categoriesLoading: boolean
  selectedCategories: string[]
  selectedOccasions: string[]
  sort: SortValue
  search: string
  minPrice: number
  maxPrice: number
  priceBounds: [number, number]
  onSale: boolean
  inStock: boolean
  newArrivals: boolean
  bestSellers: boolean
  activeChips: Array<{ key: string; label: string; remove: Record<string, string | null> }>
  updateFilters: (updates: Record<string, string | null>) => void
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-[rgba(201,168,76,0.1)] py-6">
      <button type="button" onClick={onToggle} className="mb-4 flex w-full items-center justify-between">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-[rgba(201,168,76,0.7)]">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={14} className="text-[rgba(201,168,76,0.7)]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export function ShopFilters(props: ShopFiltersProps) {
  const {
    categories,
    categoriesLoading,
    selectedCategories,
    selectedOccasions,
    sort,
    search,
    minPrice,
    maxPrice,
    priceBounds,
    onSale,
    inStock,
    newArrivals,
    bestSellers,
    activeChips,
    updateFilters,
  } = props

  const [searchQuery, setSearchQuery] = useState(search)
  const [openSections, setOpenSections] = useState({
    categories: true,
    occasions: true,
    price: true,
    quick: true,
    sort: true,
  })

  useEffect(() => {
    if (searchQuery === search) return
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery || null })
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, search, updateFilters])

  const selectedCategorySet = useMemo(() => new Set(selectedCategories), [selectedCategories])
  const selectedOccasionSet = useMemo(() => new Set(selectedOccasions), [selectedOccasions])

  const applyMultiSelect = (key: string, values: string[]) => updateFilters({ [key]: values.length > 0 ? values.join(',') : null })
  const toggleCategory = (slug: string) => {
    const current = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug]

    updateFilters({
      category: current.length > 0 ? current.join(',') : null,
    })
  }

  const sortOptions: Array<{ value: SortValue; label: string }> = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'oldest', label: 'Oldest First' },
  ]

  return (
    <aside
      className="shop-sidebar-scroll"
      style={{
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        flexShrink: 0,
        position: 'sticky',
        top: '100px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '16px',
      }}
    >
      {activeChips.length > 0 && (
        <div className="mb-6 border-b border-[rgba(201,168,76,0.1)] pb-6">
          <p className="mb-3 font-cinzel text-[9px] uppercase tracking-[0.3em] text-gold">Active Filters</p>
          <div className="mb-2 flex flex-wrap gap-2">
            <AnimatePresence>
              {activeChips.map((chip, index) => (
                <motion.button
                  key={chip.key}
                  type="button"
                  onClick={() => updateFilters(chip.remove)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.04 }}
                  className="flex items-center gap-1 border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] px-2.5 py-1 font-lufga text-xs font-light text-cream"
                >
                  {chip.label}
                  <X size={10} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() =>
              updateFilters({
                category: null,
                occasion: null,
                min: null,
                max: null,
                on_sale: null,
                in_stock: null,
                new_arrivals: null,
                best_sellers: null,
                sort: null,
                search: null,
                page: null,
              })
            }
            className="font-lufga text-xs font-light text-[rgba(201,168,76,0.6)] hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="relative">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[rgba(201,168,76,0.5)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full border-b border-[rgba(201,168,76,0.2)] bg-transparent py-[10px] pl-6 pr-6 font-lufga text-sm font-light text-cream outline-none caret-gold"
          />
          {searchQuery && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[rgba(201,168,76,0.5)]"
            >
              <X size={14} />
            </motion.button>
          )}
        </div>
      </div>

      <Section
        title="Categories"
        open={openSections.categories}
        onToggle={() => setOpenSections((prev) => ({ ...prev, categories: !prev.categories }))}
      >
        {categoriesLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-5 animate-[pulse_2s_infinite] bg-[rgba(253,244,232,0.04)]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="font-lufga text-xs font-light italic text-[rgba(253,244,232,0.3)]">Could not load categories</p>
        ) : (
          <div className="flex flex-col gap-0">
            {categories.map((cat, i) => {
              const isSelected = selectedCategorySet.has(cat.slug)
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => toggleCategory(cat.slug)}
                  whileHover={{ x: 2 }}
                  className="flex cursor-pointer items-center justify-between border-b border-[rgba(201,168,76,0.05)] py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      animate={{
                        background: isSelected ? '#c9a84c' : 'transparent',
                        borderColor: isSelected ? '#c9a84c' : 'rgba(201,168,76,0.3)',
                      }}
                      transition={{ duration: 0.15 }}
                      className="flex h-4 w-4 shrink-0 items-center justify-center border border-[rgba(201,168,76,0.3)]"
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check size={10} color="#0f0608" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.div>
                    <span
                      className="font-lufga text-sm font-light leading-none transition-colors"
                      style={{ color: isSelected ? '#c9a84c' : '#fdf4e8' }}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-lufga text-[11px] font-light text-[rgba(201,168,76,0.4)]">({cat.count})</span>
                </motion.div>
              )
            })}
          </div>
        )}
      </Section>

      <Section
        title="Occasions"
        open={openSections.occasions}
        onToggle={() => setOpenSections((prev) => ({ ...prev, occasions: !prev.occasions }))}
      >
        {OCCASIONS.map((occasion) => {
          const checked = selectedOccasionSet.has(occasion.slug)
          return (
            <button
              type="button"
              key={occasion.slug}
              onClick={() => {
                const next = checked
                  ? selectedOccasions.filter((slug) => slug !== occasion.slug)
                  : [...selectedOccasions, occasion.slug]
                applyMultiSelect('occasion', next)
              }}
              className="flex w-full items-center border-b border-[rgba(201,168,76,0.05)] px-2 py-2.5 hover:bg-[rgba(201,168,76,0.04)]"
            >
              <motion.span
                className={`mr-2.5 flex h-4 w-4 items-center justify-center border ${
                  checked ? 'border-gold bg-gold' : 'border-[rgba(201,168,76,0.3)]'
                }`}
                animate={{ scale: checked ? 1 : 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {checked && <Check size={10} className="text-ink" />}
              </motion.span>
              <span className="font-lufga text-sm font-light text-cream">{occasion.label}</span>
            </button>
          )
        })}
      </Section>

      <Section
        title="Price Range"
        open={openSections.price}
        onToggle={() => setOpenSections((prev) => ({ ...prev, price: !prev.price }))}
      >
        <PriceRangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={[minPrice, maxPrice]}
          onChange={(value) => updateFilters({ min: String(value[0]), max: String(value[1]) })}
        />
      </Section>

      <Section
        title="Quick Filters"
        open={openSections.quick}
        onToggle={() => setOpenSections((prev) => ({ ...prev, quick: !prev.quick }))}
      >
        {[
          { key: 'on_sale', label: 'On Sale', icon: Tag, color: 'text-rose', active: onSale },
          { key: 'in_stock', label: 'In Stock', icon: Package, color: 'text-gold', active: inStock },
          { key: 'new_arrivals', label: 'New Arrivals', icon: Sparkles, color: 'text-gold', active: newArrivals },
          { key: 'best_sellers', label: 'Best Sellers', icon: Star, color: 'text-gold', active: bestSellers },
        ].map((filter) => {
          const Icon = filter.icon
          return (
            <div key={filter.key} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Icon size={14} className={filter.color} />
                <span className="font-lufga text-sm font-light text-cream">{filter.label}</span>
              </div>
              <button
                type="button"
                onClick={() => updateFilters({ [filter.key]: filter.active ? null : 'true' })}
                className={`relative h-5 w-9 border border-transparent transition-colors ${
                  filter.active
                    ? filter.key === 'on_sale'
                      ? 'bg-rose'
                      : 'bg-gold'
                    : 'bg-[rgba(253,244,232,0.1)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 bg-ink transition-all ${
                    filter.active ? 'left-[calc(100%-18px)]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </Section>

      <Section
        title="Sort By"
        open={openSections.sort}
        onToggle={() => setOpenSections((prev) => ({ ...prev, sort: !prev.sort }))}
      >
        {sortOptions.map((option) => {
          const selected = sort === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFilters({ sort: option.value })}
              className="flex w-full items-center gap-2 py-2 text-left"
            >
              <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${selected ? 'border-gold' : 'border-[rgba(201,168,76,0.3)]'}`}>
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
              </span>
              <span className="font-lufga text-sm font-light text-cream">{option.label}</span>
            </button>
          )
        })}
      </Section>
    </aside>
  )
}
