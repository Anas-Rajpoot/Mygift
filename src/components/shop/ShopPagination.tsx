'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ShopPaginationProps {
  page: number
  totalPages: number
  total: number
  perPage: number
  onPageChange: (nextPage: number) => void
}

function buildPages(current: number, totalPages: number) {
  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i += 1) {
    const show = i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)
    if (show) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  return pages
}

export function ShopPagination({ page, totalPages, total, perPage, onPageChange }: ShopPaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)
  const start = Math.min((page - 1) * perPage + 1, total)
  const end = Math.min(page * perPage, total)

  return (
    <div className="mt-16">
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 w-10 items-center justify-center border border-[rgba(201,168,76,0.15)] text-cream disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((entry, index) =>
          entry === '...' ? (
            <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center font-lufga text-sm text-muted">
              ...
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              className={`h-10 w-10 border font-lufga text-sm ${
                page === entry
                  ? 'border-transparent bg-gold text-ink'
                  : 'border-[rgba(201,168,76,0.15)] text-cream hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.06)]'
              }`}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-10 w-10 items-center justify-center border border-[rgba(201,168,76,0.15)] text-cream disabled:cursor-default disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="mt-4 text-center font-lufga text-[13px] font-light text-muted">
        Showing {start}–{end} of {total} products
      </p>
    </div>
  )
}
