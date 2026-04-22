'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, MapPin, User, Package, HelpCircle } from 'lucide-react';
import { useAuthStore, useIsAuthenticated, useUser } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

const accountLinks = [
  {
    title: 'Orders',
    description: 'View your order history and track shipments',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Addresses',
    description: 'Manage your billing and shipping addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Account Details',
    description: 'Update your name, email, and password',
    href: '/account/details',
    icon: User,
  },
];

export default function AccountPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-[var(--surface-2)] mb-4"></div>
          <div className="h-4 w-64 bg-[var(--surface-2)] mb-8"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[var(--surface-2)]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl font-light text-[var(--cream)]">My Account</h1>
          <p className="mt-2 text-[var(--muted)]">
            Welcome back, {user?.displayName || user?.firstName || 'there'}!
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      {/* Quick Links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accountLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-[var(--border)] p-6 transition-colors hover:border-[var(--gold)]"
            >
              <Icon size={24} strokeWidth={1.5} className="text-[var(--muted)] transition-colors group-hover:text-[var(--gold)]" />
              <h2 className="mt-4 font-heading text-lg text-[var(--cream)]">{link.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{link.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Account Info Summary */}
      <div className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="font-heading text-xl text-[var(--cream)]">Account Information</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Contact</h3>
            <p className="mt-2 text-[var(--cream)]">{user?.displayName}</p>
            <p className="text-sm text-[var(--muted)]">{user?.email}</p>
            <Link
              href="/account/details"
              className="mt-2 inline-block text-sm text-[var(--muted)] underline transition-colors hover:text-[var(--gold)]"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="font-heading text-xl text-[var(--cream)]">Need Help?</h2>
        <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
          <p>
            <Link href="/customer-service" className="underline transition-colors hover:text-[var(--gold)]">
              Contact Customer Service
            </Link>
          </p>
          <p>
            <Link href="/faq" className="underline transition-colors hover:text-[var(--gold)]">
              View FAQs
            </Link>
          </p>
          <p>
            <Link href="/size-guide" className="underline transition-colors hover:text-[var(--gold)]">
              Size Guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
