'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCartStore,
  useCartItems,
  useCartIsOpen,
  useCartTotal,
} from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  ImageIcon,
} from 'lucide-react';

export function CartDrawer() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const total = useCartTotal();
  const { closeCart, removeItem, updateQuantity } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--surface)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 className="font-heading text-lg text-[var(--cream)]">
                Shopping Bag ({items.length})
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart
                    size={48}
                    className="text-[var(--muted)]"
                    strokeWidth={1}
                  />
                  <p className="mt-4 text-[var(--muted)]">
                    Your bag is empty
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-4 border border-[var(--border)] px-6 py-2 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] transition-colors hover:border-[var(--border-hover)]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[var(--surface-2)]"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon
                              size={24}
                              className="text-[var(--muted)]"
                              strokeWidth={1}
                            />
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="font-heading text-sm text-[var(--cream)] hover:text-[var(--gold)]"
                            >
                              {item.name}
                            </Link>
                            {item.attributes &&
                              Object.keys(item.attributes).length > 0 && (
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                  {Object.entries(item.attributes)
                                    .map(
                                      ([key, value]) => `${key}: ${value}`
                                    )
                                    .join(', ')}
                                </p>
                              )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[var(--muted)] transition-colors hover:text-[var(--rose)]"
                            aria-label="Remove item"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          {/* Quantity */}
                          <div className="flex items-center border border-[var(--border)]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-1 text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm text-[var(--cream)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                item.maxQuantity
                                  ? item.quantity >= item.maxQuantity
                                  : false
                              }
                              className="px-2 py-1 text-[var(--muted)] transition-colors hover:text-[var(--gold)] disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-sm text-[var(--gold)]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--border)] px-6 py-4">
                <div className="flex justify-between font-heading text-base">
                  <span className="text-[var(--cream)]">Subtotal</span>
                  <span className="text-[var(--gold)]">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-4 space-y-2">
                  <Link href="/checkout" onClick={closeCart}>
                    <button
                      type="button"
                      className="w-full bg-[var(--gold)] py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)]"
                    >
                      Checkout
                    </button>
                  </Link>
                  <Link href="/cart" onClick={closeCart}>
                    <button
                      type="button"
                      className="w-full border border-[var(--border)] py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] transition-colors hover:border-[var(--border-hover)]"
                    >
                      View Bag
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
