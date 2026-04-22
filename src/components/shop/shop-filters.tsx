'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useTransition, useEffect, useRef } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { WCCategory } from '@/types/woocommerce';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

type ParamValue = string | undefined;

function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const navigate = useCallback(
    (updates: Record<string, ParamValue>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (resetPage && !updates.page) {
        params.delete('page');
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
      });
    },
    [router, pathname, searchParams, startTransition],
  );

  return { searchParams, navigate };
}

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { label: 'Newest', orderby: 'date', order: 'desc' },
  { label: 'Price: Low to High', orderby: 'price', order: 'asc' },
  { label: 'Price: High to Low', orderby: 'price', order: 'desc' },
  { label: 'Popularity', orderby: 'popularity', order: 'desc' },
  { label: 'Rating', orderby: 'rating', order: 'desc' },
] as const;

function sortKey(orderby?: string, order?: string) {
  return `${orderby ?? 'date'}-${order ?? 'desc'}`;
}

// ---------------------------------------------------------------------------
// ActiveFilterPills
// ---------------------------------------------------------------------------

export function ActiveFilterPills() {
  const { searchParams, navigate } = useFilterNavigation();

  const pills: { label: string; clear: Record<string, ParamValue> }[] = [];

  const search = searchParams.get('search');
  if (search) pills.push({ label: `Search: "${search}"`, clear: { search: undefined } });

  const category = searchParams.get('category');
  const categoryName = searchParams.get('category_name');
  if (category) pills.push({ label: categoryName || `Category #${category}`, clear: { category: undefined, category_name: undefined } });

  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  if (minPrice || maxPrice) {
    const label = minPrice && maxPrice
      ? `PKR ${minPrice} - ${maxPrice}`
      : minPrice
        ? `Min PKR ${minPrice}`
        : `Max PKR ${maxPrice}`;
    pills.push({ label, clear: { min_price: undefined, max_price: undefined } });
  }

  const stockStatus = searchParams.get('stock_status');
  if (stockStatus) {
    const labels: Record<string, string> = { instock: 'In Stock', outofstock: 'Out of Stock', onbackorder: 'On Backorder' };
    pills.push({ label: labels[stockStatus] || stockStatus, clear: { stock_status: undefined } });
  }

  const onSale = searchParams.get('on_sale');
  if (onSale === 'true') pills.push({ label: 'On Sale', clear: { on_sale: undefined } });

  const featured = searchParams.get('featured');
  if (featured === 'true') pills.push({ label: 'Featured', clear: { featured: undefined } });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill.label}
          type="button"
          onClick={() => navigate(pill.clear)}
          className="flex items-center gap-1.5 border border-[var(--border)] px-3 py-1 font-accent text-[10px] uppercase tracking-[0.15em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          {pill.label}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GridToggle
// ---------------------------------------------------------------------------

export function GridToggle() {
  const { searchParams, navigate } = useFilterNavigation();
  const current = parseInt(searchParams.get('cols') || '3', 10) as 2 | 3 | 4;

  const options: { cols: 2 | 3 | 4; icon: typeof Grid2x2 }[] = [
    { cols: 2, icon: Grid2x2 },
    { cols: 3, icon: Grid3x3 },
    { cols: 4, icon: LayoutGrid },
  ];

  return (
    <div className="flex items-center gap-1">
      {options.map(({ cols, icon: Icon }) => (
        <button
          key={cols}
          type="button"
          onClick={() => navigate({ cols: cols === 3 ? undefined : String(cols) })}
          className={`p-1.5 transition-colors ${
            current === cols
              ? 'text-[var(--gold)]'
              : 'text-[var(--muted)] hover:text-[var(--gold)]'
          }`}
          aria-label={`${cols} columns`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SortDropdown (toolbar)
// ---------------------------------------------------------------------------

export function SortDropdown() {
  const { searchParams, navigate } = useFilterNavigation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentKey = sortKey(
    searchParams.get('orderby') ?? undefined,
    searchParams.get('order') ?? undefined,
  );
  const currentLabel = SORT_OPTIONS.find(
    (o) => sortKey(o.orderby, o.order) === currentKey,
  )?.label ?? 'Newest';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2 font-accent text-[10px] uppercase tracking-[0.15em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        {currentLabel}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[200px] border border-[var(--border)] bg-[var(--surface)]">
          {SORT_OPTIONS.map((opt) => {
            const key = sortKey(opt.orderby, opt.order);
            const active = key === currentKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  navigate({ orderby: opt.orderby, order: opt.order });
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2.5 text-left font-sans text-sm transition-colors ${
                  active
                    ? 'bg-[var(--surface-2)] text-[var(--gold)]'
                    : 'text-[var(--cream)] hover:bg-[var(--surface-2)] hover:text-[var(--gold)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar filters content (shared between desktop & mobile drawer)
// ---------------------------------------------------------------------------

interface SidebarFiltersContentProps {
  categories: WCCategory[];
  onClose?: () => void;
}

function SidebarFiltersContent({ categories, onClose }: SidebarFiltersContentProps) {
  const { searchParams, navigate } = useFilterNavigation();

  // Local state for search input
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Local state for price range
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');

  // Sync local state with URL params when they change externally
  useEffect(() => {
    setSearchValue(searchParams.get('search') ?? '');
    setMinPrice(searchParams.get('min_price') ?? '');
    setMaxPrice(searchParams.get('max_price') ?? '');
  }, [searchParams]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        navigate({ search: value || undefined });
      }, 500);
    },
    [navigate],
  );

  const handlePriceApply = useCallback(() => {
    navigate({
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
    });
  }, [navigate, minPrice, maxPrice]);

  const activeCategory = searchParams.get('category');
  const activeStockStatus = searchParams.get('stock_status');
  const activeOnSale = searchParams.get('on_sale') === 'true';
  const activeFeatured = searchParams.get('featured') === 'true';
  const activeOrderby = searchParams.get('orderby') ?? 'date';
  const activeOrder = searchParams.get('order') ?? 'desc';

  const handleClearAll = useCallback(() => {
    navigate({
      search: undefined,
      category: undefined,
      category_name: undefined,
      min_price: undefined,
      max_price: undefined,
      stock_status: undefined,
      on_sale: undefined,
      featured: undefined,
      orderby: undefined,
      order: undefined,
      page: undefined,
      cols: undefined,
    });
    onClose?.();
  }, [navigate, onClose]);

  const sectionHeading = 'font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]';
  const divider = 'h-px bg-[var(--border)]';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className={sectionHeading}>Search</h3>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-[var(--border)] bg-transparent py-2 pl-10 pr-3 font-sans text-sm text-[var(--cream)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--gold)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className={divider} />

      {/* Categories */}
      <div>
        <h3 className={sectionHeading}>Categories</h3>
        <ul className="mt-3 space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => navigate({ category: undefined, category_name: undefined })}
              className={`w-full text-left font-sans text-sm transition-colors ${
                !activeCategory
                  ? 'text-[var(--gold)]'
                  : 'text-[var(--muted)] hover:text-[var(--gold)]'
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    category: String(cat.id),
                    category_name: cat.name,
                  })
                }
                className={`flex w-full items-center justify-between text-left font-sans text-sm transition-colors ${
                  activeCategory === String(cat.id)
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--muted)] hover:text-[var(--gold)]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="font-accent text-xs text-[var(--muted)]">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={divider} />

      {/* Price Range */}
      <div>
        <h3 className={sectionHeading}>Price Range</h3>
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-accent text-[10px] text-[var(--muted)]">PKR</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full border border-[var(--border)] bg-transparent py-2 pl-11 pr-2 font-sans text-sm text-[var(--cream)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
          <span className="text-[var(--muted)]">&mdash;</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-accent text-[10px] text-[var(--muted)]">PKR</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full border border-[var(--border)] bg-transparent py-2 pl-11 pr-2 font-sans text-sm text-[var(--cream)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handlePriceApply}
          className="mt-3 w-full border border-[var(--border)] py-2 font-accent text-[10px] uppercase tracking-[0.15em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          Apply Price
        </button>
      </div>

      <div className={divider} />

      {/* Availability */}
      <div>
        <h3 className={sectionHeading}>Availability</h3>
        <div className="mt-3 space-y-2">
          {(
            [
              { value: 'instock', label: 'In Stock' },
              { value: 'outofstock', label: 'Out of Stock' },
              { value: 'onbackorder', label: 'On Backorder' },
            ] as const
          ).map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 text-sm">
              <span
                className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                  activeStockStatus === value
                    ? 'border-[var(--gold)] bg-[var(--gold)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {activeStockStatus === value && (
                  <svg className="h-2.5 w-2.5 text-[var(--ink)]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={activeStockStatus === value}
                onChange={() =>
                  navigate({
                    stock_status: activeStockStatus === value ? undefined : value,
                  })
                }
              />
              <span className={`font-sans transition-colors ${activeStockStatus === value ? 'text-[var(--gold)]' : 'text-[var(--muted)] hover:text-[var(--cream)]'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={divider} />

      {/* Sale Status */}
      <div>
        <h3 className={sectionHeading}>Sale Status</h3>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <span
              className={`relative h-5 w-9 transition-colors ${
                activeOnSale ? 'bg-[var(--gold)]' : 'bg-[var(--surface-2)]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 bg-[var(--ink)] transition-all ${
                  activeOnSale ? 'left-[calc(100%-18px)]' : 'left-0.5'
                }`}
                style={{ borderRadius: '1px' }}
              />
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={activeOnSale}
              onChange={() => navigate({ on_sale: activeOnSale ? undefined : 'true' })}
            />
            <span className={`font-sans transition-colors ${activeOnSale ? 'text-[var(--gold)]' : 'text-[var(--muted)]'}`}>
              On Sale
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <span
              className={`relative h-5 w-9 transition-colors ${
                activeFeatured ? 'bg-[var(--gold)]' : 'bg-[var(--surface-2)]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 bg-[var(--ink)] transition-all ${
                  activeFeatured ? 'left-[calc(100%-18px)]' : 'left-0.5'
                }`}
                style={{ borderRadius: '1px' }}
              />
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={activeFeatured}
              onChange={() => navigate({ featured: activeFeatured ? undefined : 'true' })}
            />
            <span className={`font-sans transition-colors ${activeFeatured ? 'text-[var(--gold)]' : 'text-[var(--muted)]'}`}>
              Featured
            </span>
          </label>
        </div>
      </div>

      <div className={divider} />

      {/* Sort By */}
      <div>
        <h3 className={sectionHeading}>Sort By</h3>
        <div className="mt-3 space-y-1.5">
          {SORT_OPTIONS.map((opt) => {
            const active =
              activeOrderby === opt.orderby && activeOrder === opt.order;
            return (
              <button
                key={sortKey(opt.orderby, opt.order)}
                type="button"
                onClick={() => navigate({ orderby: opt.orderby, order: opt.order })}
                className={`flex w-full items-center gap-3 py-1 text-left font-sans text-sm transition-colors ${
                  active
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--muted)] hover:text-[var(--gold)]'
                }`}
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors ${
                    active ? 'border-[var(--gold)]' : 'border-[var(--border)]'
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={divider} />

      {/* Clear All */}
      <button
        type="button"
        onClick={handleClearAll}
        className="w-full border border-[var(--gold)] py-2.5 font-accent text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--ink)]"
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop sidebar (sticky wrapper)
// ---------------------------------------------------------------------------

export function DesktopSidebar({ categories }: { categories: WCCategory[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <SidebarFiltersContent categories={categories} />
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Mobile filter drawer
// ---------------------------------------------------------------------------

export function MobileFilterDrawer({ categories }: { categories: WCCategory[] }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2 font-accent text-[10px] uppercase tracking-[0.15em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)] lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-[320px] max-w-[85vw] transform bg-[var(--surface)] transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="font-accent text-[11px] uppercase tracking-[0.3em] text-[var(--gold)]">
            Filters
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100vh-57px)] overflow-y-auto px-6 py-6">
          <SidebarFiltersContent categories={categories} onClose={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { navigate } = useFilterNavigation();

  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const pages: (number | 'ellipsis')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const btnBase =
    'flex h-10 w-10 items-center justify-center border font-sans text-sm transition-colors';

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => navigate({ page: String(currentPage - 1) }, false)}
        className={`${btnBase} ${
          currentPage <= 1
            ? 'cursor-not-allowed border-[var(--border)] text-[var(--surface-2)]'
            : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-10 w-10 items-center justify-center font-sans text-sm text-[var(--muted)]"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => navigate({ page: p === 1 ? undefined : String(p) }, false)}
            className={`${btnBase} ${
              p === currentPage
                ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
            }`}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => navigate({ page: String(currentPage + 1) }, false)}
        className={`${btnBase} ${
          currentPage >= totalPages
            ? 'cursor-not-allowed border-[var(--border)] text-[var(--surface-2)]'
            : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
