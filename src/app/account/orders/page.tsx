'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIsAuthenticated, useAuthToken } from '@/stores/auth-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
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

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthToken();

  const [orders, setOrders] = useState<WCOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/account/login?redirect=/account/orders');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && token) {
      fetchOrders();
    }
  }, [mounted, isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/account/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isAuthenticated) {
    return null;
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
          <li className="text-[var(--cream)]">Orders</li>
        </ol>
      </nav>

      <h1 className="font-heading text-3xl font-light text-[var(--cream)]">Order History</h1>
      <p className="mt-2 text-[var(--muted)]">
        View and track your recent orders.
      </p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border border-[var(--border)] p-6">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-[var(--surface-2)]"></div>
                <div className="h-4 w-20 bg-[var(--surface-2)]"></div>
              </div>
              <div className="mt-4 h-4 w-48 bg-[var(--surface-2)]"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 border border-[var(--rose)]/30 bg-[var(--rose)]/10 p-4 text-sm text-[var(--rose)]">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-center py-12 border border-[var(--border)]">
          <ShoppingBag className="mx-auto h-12 w-12 text-[var(--muted)]" strokeWidth={1} />
          <h2 className="mt-4 font-heading text-lg font-medium text-[var(--cream)]">No orders yet</h2>
          <p className="mt-1 text-[var(--muted)]">Start shopping to see your orders here.</p>
          <Link href="/shop">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-[var(--border)] p-6 transition-colors hover:border-[var(--border-hover)]"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--cream)]">Order #{order.number}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium ${
                        statusColors[order.status] || 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]'
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Placed on{' '}
                    {new Date(order.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[var(--cream)]">{formatPrice(parseFloat(order.total))}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <div className="space-y-2">
                  {order.line_items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-[var(--cream)]">{formatPrice(parseFloat(item.total))}</span>
                    </div>
                  ))}
                  {order.line_items.length > 3 && (
                    <p className="text-sm text-[var(--muted)]">
                      +{order.line_items.length - 3} more item{order.line_items.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* View Details Link */}
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-light)] hover:underline"
                >
                  View Order Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
