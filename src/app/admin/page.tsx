'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Package, Tag, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { fetchShopProducts } from '@/app/actions/shop'
import { fetchCollection } from '@/components/admin/admin-api'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, banners: 0, promo: 0 })

  useEffect(() => {
    Promise.all([
      fetchShopProducts({ perPage: 1, page: 1 }),
      fetchCollection<{ id: string }>('banners').catch(() => []),
      fetchCollection<{ id: string; isActive: boolean }>('promo-codes').catch(() => []),
    ]).then(([products, banners, promo]) => {
      setStats({
        products: products.total,
        orders: 0,
        banners: banners.filter(Boolean).length,
        promo: promo.filter((p) => p.isActive).length,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package },
    { label: 'Total Orders', value: stats.orders, icon: LayoutDashboard },
    { label: 'Active Banners', value: stats.banners, icon: ImageIcon },
    { label: 'Promo Codes Active', value: stats.promo, icon: Tag },
  ]

  const links = [
    { href: '/admin/banners', label: 'Edit Banners' },
    { href: '/admin/home-image-banners', label: 'Manage Home Image Banners' },
    { href: '/admin/promo-codes', label: 'Add Promo Code' },
    { href: '/admin/header-links', label: 'Manage Header Links' },
    { href: '/admin/footer-links', label: 'Manage Footer Links' },
    { href: '/admin/footer-payments', label: 'Manage Footer Payments' },
    { href: '/admin/site-settings', label: 'Update WhatsApp' },
    { href: '/admin/cities', label: 'Manage Cities' },
    { href: '/admin/site-settings?tab=domain-payments', label: 'Connect Domain & Foreign Payments' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="border border-[#e8e0d4] bg-white p-6">
              <Icon size={24} className="text-[#c9a84c]" />
              <p className="mt-4 font-lufga text-4xl font-bold text-[#1a0c10]">{card.value}</p>
              <p className="font-lufga text-sm font-light text-[#8a7060]">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center justify-between border border-[#e8e0d4] bg-white p-5">
            <span className="font-lufga text-sm text-[#2a1a14]">{item.label}</span>
            <ArrowRight size={16} className="text-[#c9a84c]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
