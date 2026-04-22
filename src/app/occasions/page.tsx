'use client'

import { Suspense, useEffect, useMemo, useState, type ComponentType } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Cake,
  Flower2,
  Heart,
  HeartHandshake,
  Sparkles,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { scaleIn, stagger } from '@/lib/animations'

interface OccasionRecord {
  id: string
  slug: string
  name: string
  lucideIcon: string
  glowColor: string
  accentColor: string
  categorySlug: string
  count: number
  isActive: boolean
  sortOrder: number
}

const defaultOccasions: OccasionRecord[] = [
  { id: 'birthday', name: 'Birthday', slug: 'birthday', lucideIcon: 'Cake', count: 48, glowColor: '#7a1a3a', accentColor: '#c4687a', categorySlug: 'birthday', isActive: true, sortOrder: 1 },
  { id: 'anniversary', name: 'Anniversary', slug: 'anniversary', lucideIcon: 'Heart', count: 32, glowColor: '#6b3a15', accentColor: '#c9a84c', categorySlug: 'anniversary', isActive: true, sortOrder: 2 },
  { id: 'eid', name: 'Eid', slug: 'eid', lucideIcon: 'Star', count: 36, glowColor: '#1a4a25', accentColor: '#5aaa7a', categorySlug: 'eid', isActive: true, sortOrder: 3 },
  { id: 'wedding', name: 'Wedding', slug: 'wedding', lucideIcon: 'Sparkles', count: 24, glowColor: '#1a2a5c', accentColor: '#6a8add', categorySlug: 'wedding', isActive: true, sortOrder: 4 },
  { id: 'mothers-day', name: "Mother's Day", slug: 'mothers-day', lucideIcon: 'Flower2', count: 19, glowColor: '#5c1a4a', accentColor: '#c4687a', categorySlug: 'mothers-day', isActive: true, sortOrder: 5 },
  { id: 'valentines-day', name: "Valentine's Day", slug: 'valentines-day', lucideIcon: 'HeartHandshake', count: 27, glowColor: '#6b1b1b', accentColor: '#c4687a', categorySlug: 'valentines-day', isActive: true, sortOrder: 6 },
]

const iconByName: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  Cake,
  Heart,
  Star,
  Sparkles,
  Flower2,
  HeartHandshake,
}

function OccasionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeOccasion = searchParams.get('occasion') ?? 'all'
  const currentQuery = searchParams.toString()
  const [occasions, setOccasions] = useState<OccasionRecord[]>(defaultOccasions)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/admin/occasions', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return
        const parsed = rows
          .map((row: Record<string, unknown>) => ({
            id: String(row.id || ''),
            slug: String(row.slug || ''),
            name: String(row.name || ''),
            lucideIcon: String(row.lucideIcon || 'Sparkles'),
            glowColor: String(row.glowColor || '#3d0f1e'),
            accentColor: String(row.accentColor || '#c9a84c'),
            categorySlug: String(row.categorySlug || ''),
            count: Number(row.count || 0),
            isActive: Boolean(row.isActive ?? true),
            sortOrder: Number(row.sortOrder || 999),
          }))
          .filter((row: OccasionRecord) => row.slug && row.name && row.isActive)
          .sort((a: OccasionRecord, b: OccasionRecord) => a.sortOrder - b.sortOrder)
        if (parsed.length) setOccasions(parsed)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const activeData = useMemo(
    () => occasions.find((o) => o.slug === activeOccasion),
    [activeOccasion, occasions],
  )
  const showAllOccasions = activeOccasion === 'all' || !activeData

  return (
    <div className="min-h-screen bg-[#0f0608]">
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center border-b border-[rgba(201,168,76,0.1)] px-12 py-16 text-center"
        style={{
          background: activeData
            ? `radial-gradient(ellipse at 30% 60%, ${activeData.glowColor} 0%, #0f0608 65%)`
            : 'radial-gradient(ellipse at 30% 60%, #3d0f1e 0%, #0f0608 65%)',
          transition: 'background 0.5s ease',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 font-cinzel text-[10px] tracking-[0.5em] text-[#c9a84c]"
        >
          GIFTING
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-lufga text-[clamp(40px,6vw,72px)] font-light text-[#fdf4e8]"
        >
          {activeData ? activeData.name : 'Shop by Occasion'}
        </motion.h1>
      </div>

      <div className="sticky top-0 z-50 flex gap-1 overflow-x-auto border-b border-[rgba(201,168,76,0.1)] bg-[rgba(15,6,8,0.95)] px-8 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            if (!currentQuery) return
            router.push('/occasions', { scroll: false })
          }}
          className={`shrink-0 whitespace-nowrap border-b-2 px-5 py-4 font-lufga text-[13px] tracking-[0.05em] transition ${
            showAllOccasions
              ? 'border-[#c9a84c] font-medium text-[#c9a84c]'
              : 'border-transparent text-[rgba(253,244,232,0.5)]'
          }`}
        >
          All Occasions
        </button>
        {occasions.map((occ) => {
          const Icon = iconByName[occ.lucideIcon] || Sparkles
          const isActive = activeOccasion === occ.slug
          return (
            <button
              type="button"
              key={occ.slug}
              onClick={() => {
                if (activeOccasion === occ.slug) return
                router.push(`/occasions?occasion=${occ.slug}`, { scroll: false })
              }}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 font-lufga text-[13px] tracking-[0.05em] transition ${
                isActive
                  ? 'border-[#c9a84c] font-medium text-[#c9a84c]'
                  : 'border-transparent text-[rgba(253,244,232,0.5)]'
              }`}
            >
              <Icon size={14} />
              {occ.name}
            </button>
          )
        })}
      </div>

      {showAllOccasions ? (
        <div className="mx-auto max-w-[1200px] px-12 py-16">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[2px]"
          >
            {occasions.map((occ) => {
              const Icon = iconByName[occ.lucideIcon] || Sparkles
              return (
                <motion.button
                  key={occ.slug}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02, zIndex: 2 }}
                  onClick={() => {
                    if (activeOccasion === occ.slug) return
                    router.push(`/occasions?occasion=${occ.slug}`)
                  }}
                  className="relative flex min-h-[200px] flex-col items-start justify-end overflow-hidden border border-[rgba(201,168,76,0.08)] p-7 text-left"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, ${occ.glowColor} 0%, #1a0c10 70%)` }}
                >
                  <div className="mb-4">
                    <Icon size={32} color={occ.accentColor} />
                  </div>
                  <p className="mb-1.5 font-lufga text-3xl font-bold text-[#fdf4e8]">{occ.name}</p>
                  <p className="font-lufga text-xs font-light tracking-[0.1em] text-[#8a7060]">{occ.count} gifts</p>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,2,4,0.6)] to-transparent" />
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1200px] px-12 py-12">
          <div className="py-16 text-center">
            <p className="font-lufga text-xl font-light text-[#fdf4e8]">
              Explore {activeData?.name} gifts
            </p>
            <p className="mt-2 font-lufga text-sm font-light text-[#8a7060]">
              Filtered occasion view is active. Continue to shop page for products.
            </p>
            <Link
              href={
                activeData?.categorySlug
                  ? `/shop?occasion=${encodeURIComponent(activeData.slug)}&category=${encodeURIComponent(activeData.categorySlug)}`
                  : `/shop?occasion=${encodeURIComponent(activeData?.slug || '')}`
              }
              className="mt-6 inline-block border border-[#c9a84c] px-6 py-3 font-lufga text-sm text-[#fdf4e8] hover:bg-[#c9a84c] hover:text-[#0f0608]"
            >
              View {activeData?.name} Products
            </Link>
          </div>
        </div>
      )}

      <section className="border-t border-[#c9a84c]/20 bg-[#241318] px-4 py-14 text-center">
        <p className="font-lufga text-2xl italic font-light text-[#fdf4e8] md:text-[36px]">Can&apos;t find exactly what you want?</p>
        <Link href="/giftlab" className="mt-6 inline-block bg-[#c9a84c] px-8 py-3 font-lufga font-medium text-[#0f0608]">
          Build in GiftLab
        </Link>
      </section>
    </div>
  )
}

export default function OccasionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0f0608]">
          <p className="font-lufga text-[#8a7060]">Loading...</p>
        </div>
      }
    >
      <OccasionsContent />
    </Suspense>
  )
}
