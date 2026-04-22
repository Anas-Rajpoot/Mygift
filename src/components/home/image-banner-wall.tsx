import Image from 'next/image'
import Link from 'next/link'

export interface HomeImageBanner {
  id: string
  title: string
  subtitle?: string
  badge?: string
  imageUrl: string
  mobileImageUrl?: string
  ctaLabel?: string
  ctaHref?: string
  style?: 'full' | 'card' | 'split'
  textAlign?: 'left' | 'center'
  overlayOpacity?: number
  isActive?: boolean
  sortOrder?: number
}

const styleClass: Record<NonNullable<HomeImageBanner['style']>, string> = {
  full: 'col-span-12 min-h-[460px] md:min-h-[540px]',
  split: 'col-span-12 md:col-span-6 min-h-[320px] md:min-h-[400px]',
  card: 'col-span-12 md:col-span-4 min-h-[300px] md:min-h-[360px]',
}

export function ImageBannerWall({ banners }: { banners?: HomeImageBanner[] }) {
  const active = (banners || [])
    .filter((item) => item.isActive !== false && item.imageUrl)
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999))
  const safe = active.length ? active : []
  if (!safe.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid grid-cols-12 gap-4">
        {safe.slice(0, 5).map((item, index) => {
          const style = item.style || (index === 0 ? 'full' : index < 3 ? 'split' : 'card')
          const align = item.textAlign === 'left' ? 'items-start text-left' : 'items-center text-center'
          const overlay = Math.max(10, Math.min(85, Number(item.overlayOpacity ?? 55)))

          return (
            <article key={item.id} className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] ${styleClass[style]}`}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 80vw, 100vw"
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(6,4,5,${overlay / 100}) 0%, rgba(6,4,5,0.2) 60%, rgba(6,4,5,0.08) 100%)` }} />

              <div className={`absolute inset-0 z-10 flex justify-end p-6 md:p-10 ${align}`}>
                <div className="max-w-[520px]">
                  {item.badge ? (
                    <p className="mb-3 inline-flex border border-[var(--gold)]/60 bg-black/20 px-3 py-1 font-accent text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">
                      {item.badge}
                    </p>
                  ) : null}
                  <h3 className="font-heading text-3xl font-light leading-tight text-[var(--cream)] md:text-5xl">
                    {item.title}
                  </h3>
                  {item.subtitle ? (
                    <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
                      {item.subtitle}
                    </p>
                  ) : null}
                  {item.ctaLabel && item.ctaHref ? (
                    <Link
                      href={item.ctaHref}
                      className="mt-6 inline-flex border border-[var(--gold)] bg-[var(--gold)] px-6 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-transparent hover:text-[var(--gold)]"
                    >
                      {item.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
