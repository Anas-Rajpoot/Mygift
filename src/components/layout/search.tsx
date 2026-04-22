'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import {
  Search as SearchIcon,
  Loader2,
  ImageIcon,
  X,
  ChevronRight,
  Tag,
  Sparkles,
} from 'lucide-react';

interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  image: string | null;
  stock_status: string;
}

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Gift Hampers',
  'Birthday Gifts',
  'Wedding Collection',
  'Flowers',
  'Watches',
  'Clothing',
];

const CATEGORY_MAP: Record<string, string> = {
  'gifts': '/shop/gifts-hampers',
  'hampers': '/shop/gifts-hampers',
  'gift hampers': '/shop/gifts-hampers',
  'clothing': '/shop/clothing-fashion',
  'fashion': '/shop/clothing-fashion',
  'watches': '/shop/watches-accessories',
  'accessories': '/shop/watches-accessories',
  'digital': '/shop/digital-products',
  'flowers': '/shop/flowers-cakes',
  'cakes': '/shop/flowers-cakes',
};

function matchCategories(query: string): { name: string; href: string }[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const matched = new Map<string, string>();
  for (const [keyword, href] of Object.entries(CATEGORY_MAP)) {
    if (keyword.includes(q) || q.includes(keyword)) {
      const label = href.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? keyword;
      if (!matched.has(href)) {
        matched.set(href, label);
      }
    }
  }

  return Array.from(matched.entries()).map(([href, name]) => ({ name, href }));
}

const MAX_RESULTS = 6;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0, y: -32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.97,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const resultsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: { opacity: 0 },
};

const resultItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const categoryMatches = matchCategories(query);
  const displayedResults = results.slice(0, MAX_RESULTS);
  const totalResults = results.length;

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      // Small delay ensures the DOM is ready after animation starts
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSelectedIndex(-1);

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data.products || []);
        setHasSearched(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const navigateToResult = useCallback(
    (slug: string) => {
      router.push(`/product/${slug}`);
      onClose();
    },
    [router, onClose]
  );

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }, [query, router, onClose]);

  const handlePopularSearch = useCallback((term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Total navigable items: category matches + displayed results + (view all link if results exist)
      const totalItems =
        categoryMatches.length +
        displayedResults.length +
        (totalResults > 0 ? 1 : 0);

      if (totalItems === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        if (selectedIndex < categoryMatches.length) {
          // Category link
          router.push(categoryMatches[selectedIndex].href);
          onClose();
        } else if (selectedIndex < categoryMatches.length + displayedResults.length) {
          // Product result
          const productIndex = selectedIndex - categoryMatches.length;
          navigateToResult(displayedResults[productIndex].slug);
        } else {
          // View all link
          handleViewAll();
        }
      }
    },
    [
      onClose,
      categoryMatches,
      displayedResults,
      totalResults,
      selectedIndex,
      router,
      navigateToResult,
      handleViewAll,
    ]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('[data-search-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const showPopular = query.trim().length === 0;
  const showResults = hasSearched || isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[var(--ink)]/90 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 p-2 text-[var(--muted)] transition-colors duration-200 hover:text-[var(--gold)]"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Search Container */}
          <motion.div
            className="relative z-10 mt-[12vh] w-full max-w-2xl px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) handleViewAll();
              }}
              className="relative"
            >
              <div className="relative flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--gold)]" />
                  ) : (
                    <SearchIcon className="h-6 w-6 text-[var(--muted)]" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What are you looking for?"
                  className="w-full border-b border-[var(--border)] bg-transparent py-4 pl-10 pr-10 font-heading text-2xl text-[var(--cream)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none transition-colors duration-300"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] transition-colors duration-200 hover:text-[var(--gold)]"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Content Area */}
            <div
              ref={resultsRef}
              className="mt-6 max-h-[60vh] overflow-y-auto scrollbar-thin"
            >
              <AnimatePresence mode="wait">
                {/* Popular Searches */}
                {showPopular && (
                  <motion.div
                    key="popular"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mb-4 font-accent text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handlePopularSearch(term)}
                          className="border border-[var(--border)] px-4 py-2 font-sans text-sm text-[var(--cream)] transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] rounded-[4px]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Loading State (before first results arrive) */}
                {isLoading && !hasSearched && query.trim().length >= 2 && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--gold)]" />
                    <p className="mt-3 font-sans text-sm text-[var(--muted)]">
                      Searching...
                    </p>
                  </motion.div>
                )}

                {/* Results */}
                {showResults && !(!hasSearched && isLoading) && (
                  <motion.div
                    key="results"
                    variants={resultsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Category Suggestions */}
                    {categoryMatches.length > 0 && (
                      <div className="mb-6">
                        <p className="mb-3 font-accent text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                          Categories
                        </p>
                        <div className="space-y-1">
                          {categoryMatches.map((cat, index) => (
                            <motion.div key={cat.href} variants={resultItemVariants}>
                              <Link
                                href={cat.href}
                                onClick={onClose}
                                data-search-item
                                className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-[4px] ${
                                  selectedIndex === index
                                    ? 'border border-[var(--gold)] bg-[var(--surface)]'
                                    : 'border border-transparent hover:border-[var(--border-hover)] hover:bg-[var(--surface)]'
                                }`}
                              >
                                <Tag className="h-4 w-4 text-[var(--gold)]" />
                                <span className="font-sans text-sm text-[var(--cream)]">
                                  {cat.name}
                                </span>
                                <ChevronRight className="ml-auto h-4 w-4 text-[var(--muted)]" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Results */}
                    {displayedResults.length > 0 && (
                      <div>
                        <p className="mb-3 font-sans text-xs text-[var(--muted)]">
                          {totalResults} product{totalResults !== 1 ? 's' : ''} found
                        </p>
                        <div className="space-y-1">
                          {displayedResults.map((product, index) => {
                            const itemIndex = categoryMatches.length + index;
                            return (
                              <motion.div key={product.id} variants={resultItemVariants}>
                                <Link
                                  href={`/product/${product.slug}`}
                                  onClick={() => onClose()}
                                  data-search-item
                                  className={`flex items-center gap-4 px-3 py-3 transition-all duration-200 rounded-[4px] ${
                                    selectedIndex === itemIndex
                                      ? 'border border-[var(--gold)] bg-[var(--surface)]'
                                      : 'border border-transparent hover:border-[var(--border-hover)] hover:bg-[var(--surface)]'
                                  }`}
                                >
                                  {/* Product Image */}
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-2)]">
                                    {product.image ? (
                                      <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon className="h-5 w-5 text-[var(--muted)]" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-sans text-sm font-medium text-[var(--cream)] truncate">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {product.on_sale && product.sale_price ? (
                                        <>
                                          <span className="font-sans text-sm font-medium text-[var(--gold)]">
                                            {formatPrice(product.sale_price)}
                                          </span>
                                          <span className="font-sans text-xs text-[var(--muted)] line-through">
                                            {formatPrice(product.regular_price)}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="font-sans text-sm font-medium text-[var(--cream)]">
                                          {formatPrice(product.price)}
                                        </span>
                                      )}
                                    </div>
                                    {product.stock_status === 'outofstock' && (
                                      <span className="font-sans text-xs text-[var(--rose)] mt-0.5 inline-block">
                                        Out of stock
                                      </span>
                                    )}
                                  </div>

                                  {/* Arrow */}
                                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--muted)]" />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* View All Results */}
                        {totalResults > 0 && (
                          <motion.div variants={resultItemVariants}>
                            <button
                              type="button"
                              onClick={handleViewAll}
                              data-search-item
                              className={`mt-3 flex w-full items-center justify-center gap-2 py-3 font-sans text-sm transition-all duration-200 rounded-[4px] ${
                                selectedIndex === categoryMatches.length + displayedResults.length
                                  ? 'border border-[var(--gold)] text-[var(--gold)] bg-[var(--surface)]'
                                  : 'border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-hover)] hover:text-[var(--gold)]'
                              }`}
                            >
                              View all {totalResults} result{totalResults !== 1 ? 's' : ''}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Empty State */}
                    {hasSearched && results.length === 0 && !isLoading && (
                      <motion.div
                        variants={resultItemVariants}
                        className="py-12 text-center"
                      >
                        <Sparkles className="mx-auto h-10 w-10 text-[var(--muted)]" />
                        <p className="mt-4 font-heading text-xl text-[var(--cream)]">
                          No products found
                        </p>
                        <p className="mt-2 font-sans text-sm text-[var(--muted)]">
                          Try different keywords or browse our collections
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            router.push('/shop');
                            onClose();
                          }}
                          className="mt-4 border border-[var(--border)] px-6 py-2 font-sans text-sm text-[var(--cream)] transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] rounded-[4px]"
                        >
                          Browse All Products
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Keyboard hint */}
            <div className="mt-4 flex items-center justify-center gap-4 pb-2">
              <span className="font-sans text-[11px] text-[var(--muted)]">
                <kbd className="mr-1 inline-block border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] rounded-[2px]">
                  ESC
                </kbd>
                close
              </span>
              <span className="font-sans text-[11px] text-[var(--muted)]">
                <kbd className="mr-1 inline-block border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] rounded-[2px]">
                  &uarr;&darr;
                </kbd>
                navigate
              </span>
              <span className="font-sans text-[11px] text-[var(--muted)]">
                <kbd className="mr-1 inline-block border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] rounded-[2px]">
                  &crarr;
                </kbd>
                select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
