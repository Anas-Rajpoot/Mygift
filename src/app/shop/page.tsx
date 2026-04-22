'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import type { WCCategory, WCProduct } from '@/types/woocommerce'
import { fetchPriceRange, fetchShopCategories, fetchShopProducts } from '@/app/actions/shop'
import { ProductCardSkeleton } from '@/components/shop/ProductCardSkeleton'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { ShopPagination } from '@/components/shop/ShopPagination'
import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { ShopToolbar } from '@/components/shop/ShopToolbar'

const PER_PAGE = 24
const OCCASION_LABELS: Record<string, string> = {
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  eid: 'Eid',
  wedding: 'Wedding',
  'mothers-day': "Mother's Day",
  'valentines-day': "Valentine's Day",
}

const SORT_LABELS: Record<string, string> = {
  newest: 'Newest First',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  popular: 'Most Popular',
  rating: 'Top Rated',
  oldest: 'Oldest First',
}

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? ''
  const occasion = searchParams.get('occasion') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const minPrice = Number(searchParams.get('min') ?? 0)
  const maxPrice = Number(searchParams.get('max') ?? 50000)
  const onSale = searchParams.get('on_sale') === 'true'
  const inStock = searchParams.get('in_stock') === 'true'
  const search = searchParams.get('search') ?? ''
  const page = Number(searchParams.get('page') ?? 1)
  const view = (searchParams.get('view') ?? 'grid') as 'grid' | 'list'
  const newArrivals = searchParams.get('new_arrivals') === 'true'
  const bestSellers = searchParams.get('best_sellers') === 'true'

  const selectedCategories = useMemo(() => category.split(',').filter(Boolean), [category])
  const selectedOccasions = useMemo(() => occasion.split(',').filter(Boolean), [occasion])

  const [heroSearch, setHeroSearch] = useState(search)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<WCProduct[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<WCCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 50000])

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const current = typeof window !== 'undefined' ? window.location.search.slice(1) : searchParams.toString()
      const params = new URLSearchParams(current)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      if (!updates.page) params.set('page', '1')
      const nextQuery = params.toString()
      if (nextQuery === current) return
      router.push(nextQuery ? `/shop?${nextQuery}` : '/shop', { scroll: false })
    },
    [router, searchParams],
  )

  useEffect(() => {
    setHeroSearch(search)
  }, [search])

  useEffect(() => {
    if (heroSearch === search) return
    const timer = setTimeout(() => updateFilters({ search: heroSearch || null }), 400)
    return () => clearTimeout(timer)
  }, [heroSearch, search, updateFilters])

  useEffect(() => {
    Promise.all([fetchShopCategories(), fetchPriceRange()])
      .then(([cats, range]) => {
        setCategories(cats)
        setPriceBounds([range.min, range.max])
      })
      .finally(() => setCategoriesLoading(false))
  }, [])

  useEffect(() => {
    setLoading(true)

    const categoryIds = categories
      .filter((cat) => selectedCategories.includes(cat.slug))
      .map((cat) => String(cat.id))
      .join(',')

    fetchShopProducts({
      category: categoryIds || undefined,
      sort,
      minPrice,
      maxPrice,
      onSale,
      inStock,
      search,
      page,
      perPage: PER_PAGE,
    }).then((result) => {
      setProducts(result.products)
      setTotal(result.total)
      setTotalPages(result.totalPages)
      setLoading(false)
    })
  }, [categories, selectedCategories, sort, minPrice, maxPrice, onSale, inStock, search, page])

  const filteredProducts = useMemo(() => {
    let next = [...products]
    if (selectedOccasions.length > 0) {
      next = next.filter((product) => {
        const haystack = `${product.name} ${product.short_description}`.toLowerCase()
        return selectedOccasions.some((o) => haystack.includes(o.replace('-', ' ')))
      })
    }
    if (newArrivals) {
      next = next.filter((product) => product.tags.some((tag) => tag.slug.toLowerCase().includes('new')))
    }
    if (bestSellers) {
      next = next.filter((product) => product.total_sales > 0)
    }
    return next
  }, [products, selectedOccasions, newArrivals, bestSellers])

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; remove: Record<string, string | null> }> = []

    selectedCategories.forEach((slug) => {
      const categoryName = categories.find((c) => c.slug === slug)?.name ?? slug
      chips.push({
        key: `category-${slug}`,
        label: categoryName,
        remove: { category: selectedCategories.filter((item) => item !== slug).join(',') || null },
      })
    })
    selectedOccasions.forEach((slug) => {
      chips.push({
        key: `occasion-${slug}`,
        label: OCCASION_LABELS[slug] ?? slug,
        remove: { occasion: selectedOccasions.filter((item) => item !== slug).join(',') || null },
      })
    })
    if (onSale) chips.push({ key: 'on-sale', label: 'On Sale', remove: { on_sale: null } })
    if (inStock) chips.push({ key: 'in-stock', label: 'In Stock', remove: { in_stock: null } })
    if (newArrivals) chips.push({ key: 'new-arrivals', label: 'New Arrivals', remove: { new_arrivals: null } })
    if (bestSellers) chips.push({ key: 'best-sellers', label: 'Best Sellers', remove: { best_sellers: null } })
    if (search) chips.push({ key: 'search', label: `Search: ${search}`, remove: { search: null } })
    if (sort !== 'newest') chips.push({ key: 'sort', label: SORT_LABELS[sort] ?? sort, remove: { sort: null } })
    if (minPrice > priceBounds[0] || maxPrice < priceBounds[1]) {
      chips.push({
        key: 'price',
        label: `₨${Number(minPrice).toLocaleString('en-PK')} - ₨${Number(maxPrice).toLocaleString('en-PK')}`,
        remove: { min: null, max: null },
      })
    }
    return chips
  }, [
    selectedCategories,
    selectedOccasions,
    onSale,
    inStock,
    newArrivals,
    bestSellers,
    search,
    sort,
    minPrice,
    maxPrice,
    categories,
    priceBounds,
  ])

  return (
    <div className="min-h-screen bg-[#0f0608]">
      <section
        className="border-b border-[rgba(201,168,76,0.1)]"
        style={{ height: 180, background: 'radial-gradient(ellipse at 50% 100%, #2a0d18 0%, #0f0608 70%)' }}
      >
        <div className="mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-8">
          <p className="mb-2 font-cinzel text-[10px] uppercase tracking-[0.5em] text-gold">MYGIFT.PK</p>
          <h1 className="mb-4 font-lufga text-5xl font-light text-cream">The Collection</h1>
          <div className="relative w-full max-w-[560px]">
            <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gold" />
            <input
              value={heroSearch}
              onChange={(event) => setHeroSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') updateFilters({ search: heroSearch || null })
              }}
              placeholder="Search by name, occasion, category..."
              className="w-full border-b border-[rgba(201,168,76,0.3)] bg-transparent py-3 pl-9 pr-2 font-lufga text-base font-light text-cream"
            />
          </div>
        </div>
      </section>

      <section className="shop-pills-row overflow-x-auto border-b border-[rgba(201,168,76,0.08)] bg-[rgba(26,12,16,0.8)] px-8 py-5">
        <div className="mx-auto flex max-w-[1400px] min-w-max items-center gap-2" style={{ scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => updateFilters({ category: null })}
            className="shrink-0 whitespace-nowrap px-5 py-2 font-lufga text-[11px] tracking-[0.1em] transition-all"
            style={{
              border: selectedCategories.length === 0 ? 'none' : '1px solid rgba(201,168,76,0.2)',
              background: selectedCategories.length === 0 ? '#c9a84c' : 'transparent',
              color: selectedCategories.length === 0 ? '#0f0608' : '#fdf4e8',
              fontWeight: selectedCategories.length === 0 ? 600 : 300,
            }}
          >
            All Products
          </button>
          {categories.map((item) => {
            const active = selectedCategories.includes(item.slug)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateFilters({ category: item.slug })}
                className="shrink-0 whitespace-nowrap px-5 py-2 font-lufga text-[11px] tracking-[0.1em] transition-all"
                style={{
                  border: active ? 'none' : '1px solid rgba(201,168,76,0.2)',
                  background: active ? '#c9a84c' : 'transparent',
                  color: active ? '#0f0608' : '#fdf4e8',
                  fontWeight: active ? 600 : 300,
                }}
              >
                {item.name} <span className="font-light">({item.count})</span>
              </button>
            )
          })}
        </div>
      </section>

      <main className="mx-auto flex max-w-[1400px] gap-12 px-6 py-10 md:px-8">
        <div className="hidden lg:block">
          <ShopFilters
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategories={selectedCategories}
            selectedOccasions={selectedOccasions}
            sort={sort as 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'oldest'}
            search={search}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceBounds={priceBounds}
            onSale={onSale}
            inStock={inStock}
            newArrivals={newArrivals}
            bestSellers={bestSellers}
            activeChips={activeChips}
            updateFilters={updateFilters}
          />
        </div>

        <div className="min-w-0 flex-1">
          <ShopToolbar
            shownCount={filteredProducts.length}
            totalCount={total}
            sort={sort as 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'oldest'}
            view={view}
            activeFilterChips={activeChips.map((chip) => ({ key: chip.key, label: chip.label, onRemove: () => updateFilters(chip.remove) }))}
            activeFilterCount={activeChips.length}
            onSortChange={(value) => updateFilters({ sort: value })}
            onViewChange={(nextView) => updateFilters({ view: nextView })}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          {loading ? (
            <div className="grid grid-cols-1 gap-[1px] bg-[rgba(201,168,76,0.06)] md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <PackageSearch size={64} className="mx-auto opacity-20" />
              <h3 className="mt-6 font-lufga text-4xl font-light text-muted">No products found</h3>
              <p className="mb-8 mt-3 font-lufga text-base font-light text-muted">Try adjusting your filters or search query</p>
              <button
                type="button"
                className="border border-gold bg-gold px-6 py-3 font-lufga text-sm font-semibold text-ink"
                onClick={() =>
                  updateFilters({
                    category: null,
                    occasion: null,
                    sort: null,
                    min: null,
                    max: null,
                    on_sale: null,
                    in_stock: null,
                    search: null,
                    page: null,
                    view: null,
                    new_arrivals: null,
                    best_sellers: null,
                  })
                }
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchParams.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 gap-[1px] bg-[rgba(201,168,76,0.06)] md:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col gap-[1px] bg-[rgba(201,168,76,0.06)]'
                  }
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={{ hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } }}>
                      <ShopProductCard product={product} view={view} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              <ShopPagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={PER_PAGE}
                onPageChange={(nextPage) => updateFilters({ page: String(nextPage) })}
              />
            </>
          )}
        </div>
      </main>

      <button
        type="button"
        className="fixed bottom-5 left-4 z-[98] flex h-12 w-[120px] items-center justify-center gap-2 border border-[rgba(201,168,76,0.3)] bg-[#1a0c10] md:hidden"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <SlidersHorizontal size={16} className="text-gold" />
        <span className="font-lufga text-xs font-medium text-cream">Filters</span>
        {activeChips.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-lufga text-[10px] text-ink">
            {activeChips.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[99] bg-[rgba(15,6,8,0.7)] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed bottom-0 left-0 top-0 z-[100] w-[min(320px,85vw)] overflow-y-auto border-r border-[rgba(201,168,76,0.2)] bg-[#1a0c10] p-6 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
            >
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute right-4 top-4 text-muted"
              >
                <X size={20} />
              </button>
              <ShopFilters
                categories={categories}
                categoriesLoading={categoriesLoading}
                selectedCategories={selectedCategories}
                selectedOccasions={selectedOccasions}
                sort={sort as 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'oldest'}
                search={search}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceBounds={priceBounds}
                onSale={onSale}
                inStock={inStock}
                newArrivals={newArrivals}
                bestSellers={bestSellers}
                activeChips={activeChips}
                updateFilters={updateFilters}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
