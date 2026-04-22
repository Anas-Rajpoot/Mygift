'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, Minus, Plus, ImageIcon, Shield, Lock } from 'lucide-react';
import { useCartStore, useCartItems, useCartTotal } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const items = useCartItems();
  const total = useCartTotal();
  const { removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center">
          <ShoppingBag size={64} strokeWidth={1} className="mx-auto text-[var(--muted)]" />
          <h1 className="mt-6 font-heading text-3xl font-light text-[var(--cream)]">Your bag is empty</h1>
          <p className="mt-2 text-[var(--muted)]">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop">
            <Button className="mt-8">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-heading text-4xl font-light text-[var(--cream)]">Shopping Bag</h1>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="border-b border-[var(--border)]">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-t border-[var(--border)] py-6">
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-[var(--surface)] lg:h-40 lg:w-32"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 128px, 96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon size={32} className="text-[var(--muted)]" strokeWidth={1} />
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-heading text-lg text-[var(--cream)] hover:text-[var(--gold)]">
                        {item.name}
                      </Link>
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {Object.entries(item.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(' | ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
                      aria-label="Remove item"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-[var(--cream)] transition-colors hover:bg-[var(--surface)]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm text-[var(--cream)]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                        className="px-3 py-2 text-[var(--cream)] transition-colors hover:bg-[var(--surface)] disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-heading text-lg text-[var(--gold)]">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-[var(--muted)]">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-4">
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
            >
              Clear bag
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="font-heading text-xl text-[var(--cream)]">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span className="text-[var(--cream)]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Shipping</span>
                <span className="text-[var(--muted)]">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Tax</span>
                <span className="text-[var(--muted)]">Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--border)] pt-6">
              <div className="flex justify-between font-heading text-lg">
                <span className="text-[var(--cream)]">Total</span>
                <span className="text-[var(--gold)]">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/shop" className="mt-4 block">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="mt-6 flex justify-center gap-4 text-[var(--muted)]">
              <Shield size={28} strokeWidth={1} />
              <Lock size={28} strokeWidth={1} />
            </div>
            <p className="mt-2 text-center text-xs text-[var(--muted)]">
              Secure checkout powered by SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
