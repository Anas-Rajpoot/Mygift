'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'

type SortValue = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'oldest'

const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'oldest', label: 'Oldest First' },
]

interface ShopToolbarProps {
  shownCount: number
  totalCount: number
  sort: SortValue
  view: 'grid' | 'list'
  activeFilterChips: Array<{ key: string; label: string; onRemove: () => void }>
  activeFilterCount: number
  onSortChange: (value: SortValue) => void
  onViewChange: (view: 'grid' | 'list') => void
  onOpenMobileFilters: () => void
}

export function ShopToolbar({
  shownCount,
  totalCount,
  sort,
  view,
  activeFilterChips,
  activeFilterCount,
  onSortChange,
  onViewChange,
  onOpenMobileFilters,
}: ShopToolbarProps) {
  const [open, setOpen] = useState(false)
  const currentSortLabel = useMemo(
    () => SORT_OPTIONS.find((option) => option.value === sort)?.label ?? 'Newest First',
    [sort],
  )

  return (
    <div className="mb-8 border-b border-[rgba(201,168,76,0.1)] pb-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-lufga text-sm font-light text-muted">
          Showing <span className="font-semibold text-cream">{shownCount}</span> of{' '}
          <span className="font-semibold text-cream">{totalCount}</span> products
        </p>

        <div className="hidden flex-1 overflow-x-auto md:block">
          <div className="flex min-w-max items-center justify-center gap-2">
            {activeFilterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] px-3 py-1 font-lufga text-xs text-cream"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="w-[220px] border border-[rgba(201,168,76,0.2)] px-4 py-2 text-left font-lufga text-sm text-cream"
            >
              Sort: {currentSortLabel}
            </button>
            {open && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-[220px] border border-[rgba(201,168,76,0.2)] bg-[#1a0c10]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSortChange(option.value)
                      setOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left font-lufga text-sm ${
                      sort === option.value ? 'bg-[rgba(201,168,76,0.15)] text-gold' : 'text-cream'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              className={`border p-2 ${
                view === 'grid'
                  ? 'border-gold bg-gold text-ink'
                  : 'border-[rgba(201,168,76,0.2)] text-muted'
              }`}
              onClick={() => onViewChange('grid')}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`border p-2 ${
                view === 'list'
                  ? 'border-gold bg-gold text-ink'
                  : 'border-[rgba(201,168,76,0.2)] text-muted'
              }`}
              onClick={() => onViewChange('list')}
            >
              <List size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="relative flex items-center gap-2 border border-[rgba(201,168,76,0.3)] px-3 py-2 md:hidden"
          >
            <SlidersHorizontal size={16} className="text-gold" />
            <span className="font-lufga text-xs font-medium text-cream">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-lufga text-[10px] text-ink">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
