'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import {
  Calendar,
  CreditCard,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  MapPin,
  Megaphone,
  Package,
  Plus,
  Settings,
  Star,
  Tag,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/home-image-banners', label: 'Home Image Banners', icon: ImageIcon },
  { href: '/admin/giftlab-boxes', label: 'GiftLab Boxes', icon: Package },
  { href: '/admin/giftlab-addons', label: 'GiftLab Add-ons', icon: Plus },
  { href: '/admin/occasions', label: 'Occasions', icon: Calendar },
  { href: '/admin/cities', label: 'Delivery Cities', icon: MapPin },
  { href: '/admin/send-to-pakistan', label: 'Send to Pakistan', icon: Globe },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
  { href: '/admin/header-links', label: 'Header Links', icon: Link2 },
  { href: '/admin/footer-links', label: 'Footer Links', icon: Link2 },
  { href: '/admin/footer-payments', label: 'Footer Payments', icon: CreditCard },
  { href: '/admin/order-tracking', label: 'Order Tracking', icon: Package },
  { href: '/admin/contact-messages', label: 'Contact Messages', icon: Megaphone },
  { href: '/admin/site-settings?tab=domain-payments', label: 'Domain & Payments', icon: Globe },
  { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/admin/login') return
    const auth = sessionStorage.getItem('admin-auth')
    if (!auth) router.push('/admin/login')
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#f8f6f0] lg:min-h-[calc(100vh-104px)]">
      <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[240px] border-r border-[rgba(201,168,76,0.15)] bg-[#1a0c10] lg:top-[104px] lg:h-[calc(100vh-104px)]">
        <div className="border-b border-[rgba(201,168,76,0.15)] p-5">
          <p className="font-cinzel text-base text-[#c9a84c]">MyGift.pk</p>
          <p className="font-lufga text-[11px] font-light text-[rgba(253,244,232,0.5)]">Admin Panel</p>
        </div>
        <nav className="overflow-y-auto py-3" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.href.includes('?tab=')
              ? pathname === '/admin/site-settings' && searchParams.get('tab') === 'domain-payments'
              : pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-5 py-3 text-sm ${
                  active
                    ? 'border-l-2 border-[#c9a84c] bg-[rgba(201,168,76,0.12)] text-[#c9a84c]'
                    : 'text-[rgba(253,244,232,0.5)] hover:bg-[rgba(201,168,76,0.06)] hover:text-[rgba(253,244,232,0.8)]'
                }`}
              >
                <Icon size={16} />
                <span className="font-lufga text-[13px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="ml-[240px] flex-1">
        <header className="sticky top-14 z-20 flex h-16 items-center justify-between border-b border-[#e8e0d4] bg-white px-8 lg:top-[104px]">
          <p className="font-lufga text-sm text-[#6b5c4e]">Admin / {pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}</p>
          <a
            href="https://mygift.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-lufga text-[13px] text-[#c9a84c]"
          >
            View Store
            <ExternalLink size={14} />
          </a>
        </header>
        <main className="min-h-[calc(100vh-64px)] bg-[#f8f6f0] p-8">{children}</main>
      </div>
    </div>
  )
}
