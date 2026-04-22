'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useIsAuthenticated, useAuthToken } from '@/stores/auth-store';
import { formatPrice } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import type { WCOrder } from '@/types/woocommerce';

const statusColors: Record<string, string> = {
  pending: 'border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold-light)]',
  processing: 'border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold-light)]',
  'on-hold': 'border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold-light)]',
  completed: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  cancelled: 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]',
  refunded: 'border border-purple-500/30 bg-purple-500/10 text-purple-400',
  failed: 'border border-[var(--rose)]/30 bg-[var(--rose)]/10 text-[var(--rose)]',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending Payment',
  processing: 'Processing',
  'on-hold': 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  failed: 'Failed',
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthToken();

  const [order, setOrder] = useState<(WCOrder & { tracking?: { carrier?: string; trackingNumber?: string; trackingUrl?: string; statusNote?: string } | null }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push(`/account/login?redirect=/account/orders/${id}`);
    }
  }, [mounted, isAuthenticated, router, id]);

  useEffect(() => {
    if (mounted && isAuthenticated && token) {
      fetchOrder();
    }
  }, [mounted, isAuthenticated, token, id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/account/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="animate-pulse">
          <div className="h-4 w-48 bg-[var(--surface-2)] mb-8"></div>
          <div className="h-8 w-64 bg-[var(--surface-2)] mb-4"></div>
          <div className="h-64 bg-[var(--surface-2)]"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-light text-[var(--cream)]">Order Not Found</h1>
          <p className="mt-2 text-[var(--muted)]">{error || 'This order could not be found.'}</p>
          <Link href="/account/orders">
            <button className="mt-6 bg-[var(--gold)] px-6 py-3 text-sm font-medium text-[var(--ink)] hover:bg-[var(--gold-light)]">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <li>
            <Link href="/account" className="hover:text-[var(--gold)]">
              Account
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/account/orders" className="hover:text-[var(--gold)]">
              Orders
            </Link>
          </li>
          <li>/</li>
          <li className="text-[var(--cream)]">#{order.number}</li>
        </ol>
      </nav>

      {/* Order Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light text-[var(--cream)]">Order #{order.number}</h1>
          <p className="mt-2 text-[var(--muted)]">
            Placed on{' '}
            {new Date(order.date_created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium ${
            statusColors[order.status] || 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]'
          }`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      {/* Order Items */}
      <div className="mt-8 border border-[var(--border)]">
        <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-6 py-4">
          <h2 className="font-heading font-medium text-[var(--cream)]">Order Items</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {order.line_items.map((item) => (
            <div key={item.id} className="flex gap-4 p-6">
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-[var(--surface-2)]">
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--muted)]">
                    <ImageIcon className="h-6 w-6" strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--cream)]">{item.name}</h3>
                    {item.meta_data.length > 0 && (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {item.meta_data
                          .filter((m) => !m.key.startsWith('_'))
                          .map((m) => `${m.key}: ${m.value}`)
                          .join(' / ')}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-[var(--muted)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-[var(--cream)]">{formatPrice(parseFloat(item.total))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 border border-[var(--border)] p-6">
        <h2 className="font-heading font-medium text-[var(--cream)]">Order Summary</h2>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span className="text-[var(--cream)]">
              {formatPrice(
                order.line_items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
              )}
            </span>
          </div>
          {parseFloat(order.discount_total) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Discount</span>
              <span className="text-emerald-400">-{formatPrice(parseFloat(order.discount_total))}</span>
            </div>
          )}
          {order.shipping_lines.map((shipping) => (
            <div key={shipping.id} className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">{shipping.method_title}</span>
              <span className="text-[var(--cream)]">{formatPrice(parseFloat(shipping.total))}</span>
            </div>
          ))}
          {parseFloat(order.total_tax) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Tax</span>
              <span className="text-[var(--cream)]">{formatPrice(parseFloat(order.total_tax))}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-lg font-medium text-[var(--cream)]">
            <span>Total</span>
            <span>{formatPrice(parseFloat(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Tracking */}
      {order.tracking && (order.tracking.trackingNumber || order.tracking.trackingUrl || order.tracking.statusNote) && (
        <div className="mt-8 border border-[var(--border)] p-6">
          <h2 className="font-heading font-medium text-[var(--cream)]">Shipment Tracking</h2>
          <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {order.tracking.carrier ? (
              <p>
                <span className="text-[var(--cream)]">Carrier:</span> {order.tracking.carrier}
              </p>
            ) : null}
            {order.tracking.trackingNumber ? (
              <p>
                <span className="text-[var(--cream)]">Tracking #:</span> {order.tracking.trackingNumber}
              </p>
            ) : null}
            {order.tracking.statusNote ? <p>{order.tracking.statusNote}</p> : null}
            {order.tracking.trackingUrl ? (
              <a
                href={order.tracking.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[var(--gold)] bg-[var(--gold)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--gold-light)]"
              >
                Track Shipment
              </a>
            ) : null}
          </div>
        </div>
      )}

      {/* Addresses */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-[var(--border)] p-6">
          <h2 className="font-heading font-medium text-[var(--cream)]">Billing Address</h2>
          <address className="mt-4 not-italic text-sm text-[var(--muted)]">
            {order.billing.first_name} {order.billing.last_name}
            <br />
            {order.billing.address_1}
            {order.billing.address_2 && (
              <>
                <br />
                {order.billing.address_2}
              </>
            )}
            <br />
            {order.billing.city}, {order.billing.state} {order.billing.postcode}
            <br />
            {order.billing.country}
            <br />
            <br />
            {order.billing.email}
            <br />
            {order.billing.phone}
          </address>
        </div>
        <div className="border border-[var(--border)] p-6">
          <h2 className="font-heading font-medium text-[var(--cream)]">Shipping Address</h2>
          <address className="mt-4 not-italic text-sm text-[var(--muted)]">
            {order.shipping.first_name} {order.shipping.last_name}
            <br />
            {order.shipping.address_1}
            {order.shipping.address_2 && (
              <>
                <br />
                {order.shipping.address_2}
              </>
            )}
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
            <br />
            {order.shipping.country}
          </address>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-8 border border-[var(--border)] p-6">
        <h2 className="font-heading font-medium text-[var(--cream)]">Payment Method</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{order.payment_method_title}</p>
      </div>

      {/* Order Notes */}
      {order.customer_note && (
        <div className="mt-8 bg-[var(--surface-2)] p-6">
          <h2 className="font-heading font-medium text-[var(--cream)]">Order Notes</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{order.customer_note}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Link href="/account/orders">
          <button className="border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--cream)] hover:border-[var(--gold)]">
            &larr; Back to Orders
          </button>
        </Link>
      </div>
    </div>
  );
}
