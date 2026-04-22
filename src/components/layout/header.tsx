'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useCartItemCount } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { useIsAuthenticated } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { Search } from './search';
import {
  Search as SearchIcon,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';

interface HeaderLinkItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  showInDesktop?: boolean;
  showInMobile?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

const defaultNavLinks: HeaderLinkItem[] = [
  { label: 'Shop', href: '/shop', hasDropdown: true },
  { label: 'Occasions', href: '/occasions', hasDropdown: false },
  { label: 'GiftLab', href: '/giftlab', hasDropdown: false },
  { label: 'Send to Pakistan', href: '/send-to-pakistan', hasDropdown: false },
  { label: 'About', href: '/about', hasDropdown: false },
];

export function Header() {
  const pathname = usePathname();
  const isGiftlab = pathname.startsWith('/giftlab');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSearchOpen, openSearch, closeSearch } = useUIStore();
  const { openCart } = useCartStore();
  const cartCount = useCartItemCount();
  const isAuthenticated = useIsAuthenticated();
  const [whatsappNumber, setWhatsappNumber] = useState('923001234567');
  const [navLinks, setNavLinks] = useState<HeaderLinkItem[]>(defaultNavLinks);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch('/api/admin/site-settings', { signal: controller.signal }).then((res) =>
        res.ok ? res.json() : []
      ),
      fetch('/api/admin/header-links', { signal: controller.signal }).then((res) =>
        res.ok ? res.json() : []
      ),
    ])
      .then(([settingsRows, navRows]) => {
        if (Array.isArray(settingsRows) && settingsRows[0]?.whatsappNumber) {
          setWhatsappNumber(settingsRows[0].whatsappNumber);
        }
        if (Array.isArray(navRows) && navRows.length > 0) {
          const parsed = navRows
            .map((row: Record<string, unknown>) => ({
              id: String(row.id || ''),
              label: String(row.label || ''),
              href: String(row.href || '#'),
              hasDropdown: Boolean(row.hasDropdown),
              showInDesktop: Boolean(row.showInDesktop ?? true),
              showInMobile: Boolean(row.showInMobile ?? true),
              isActive: Boolean(row.isActive ?? true),
              sortOrder: Number(row.sortOrder || 999),
            }))
            .filter((row: HeaderLinkItem) => row.isActive && row.label && row.href)
            .sort((a: HeaderLinkItem, b: HeaderLinkItem) => (a.sortOrder || 999) - (b.sortOrder || 999));
          if (parsed.length) setNavLinks(parsed);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (isGiftlab) return null;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed inset-x-0 top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-[var(--ink)]/95 backdrop-blur-md'
            : 'bg-[var(--ink)]'
        )}
      >
        {/* ── Top row: hamburger | logo | icons ── */}
        <div className="relative flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:h-16 lg:px-8">
          {/* Left: hamburger (mobile only) */}
          <div className="flex w-24 items-center lg:w-32">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-[var(--cream)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="font-accent text-xl tracking-[0.1em] text-[var(--gold)] lg:text-2xl">
              MyGift
            </span>
            <span className="font-heading text-xl italic text-[var(--cream)] lg:text-2xl">
              .pk
            </span>
          </Link>

          {/* Right: icons + WhatsApp */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => (isSearchOpen ? closeSearch() : openSearch())}
              className="text-[var(--cream)] transition-colors hover:text-[var(--gold)]"
              aria-label="Search"
            >
              <SearchIcon size={18} />
            </button>

            <Link
              href="/account"
              className="hidden text-[var(--cream)] transition-colors hover:text-[var(--gold)] sm:block"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative text-[var(--cream)] transition-colors hover:text-[var(--gold)]"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-[var(--gold)] text-[var(--ink)] text-[9px] font-accent font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-[var(--gold)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--gold-light)]"
              aria-label="WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="hidden font-accent text-[10px] uppercase tracking-[0.15em] sm:inline">
                WhatsApp
              </span>
            </a>
          </div>
        </div>

        {/* ── Bottom row: centered nav links (desktop only) ── */}
        <nav className="hidden lg:block border-b border-[var(--border)]">
          <ul className="mx-auto flex h-10 max-w-4xl items-center justify-center gap-8">
            {navLinks.filter((link) => link.showInDesktop !== false).map((link) => (
              <li key={link.id || link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'font-accent text-[11px] uppercase tracking-[0.2em] transition-colors',
                    pathname === link.href
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--cream)] hover:text-[var(--gold-light)]'
                  )}
                >
                  <span className="flex items-center gap-1">
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown size={12} className="opacity-50" />
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search overlay */}
        <Search isOpen={isSearchOpen} onClose={closeSearch} />
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-[var(--surface)] flex flex-col"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <span className="font-accent text-lg tracking-[0.1em] text-[var(--gold)]">
                  MyGift
                  <span className="font-heading italic text-[var(--cream)]">.pk</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--cream)]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile nav */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="space-y-6">
                  {navLinks.filter((link) => link.showInMobile !== false).map((link) => (
                    <li key={link.id || link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'font-accent text-[11px] uppercase tracking-[0.2em] transition-colors',
                          pathname === link.href
                            ? 'text-[var(--gold)]'
                            : 'text-[var(--cream)] hover:text-[var(--gold-light)]'
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Account section */}
                <div className="mt-12 border-t border-[var(--border)] pt-6">
                  <p className="font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-4">
                    Account
                  </p>
                  <Link
                    href={isAuthenticated ? '/account' : '/account/login'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-[var(--cream)] hover:text-[var(--gold)]"
                  >
                    <User size={16} />
                    <span className="font-accent text-[11px] uppercase tracking-[0.2em]">
                      {isAuthenticated ? 'My Account' : 'Sign In'}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
