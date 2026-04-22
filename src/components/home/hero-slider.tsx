'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PromoStrip } from '@/components/home/promo-strip';

type HeroSlide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  backgroundImage?: { src: string; alt?: string };
  imageOnly?: boolean;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  overlayOpacity?: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

// (kept fadeUp staggered animations; no staggerChildren used currently)

export function HeroSlider({
  slides,
  promoItems,
  secondaryCtaHref = '/send-to-pakistan',
  secondaryCtaLabel = 'Send to Pakistan',
}: {
  slides: HeroSlide[];
  promoItems?: string[];
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
}) {
  const safeSlides = useMemo(() => (slides?.length ? slides : []), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const t = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % safeSlides.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [safeSlides.length]);

  const active = safeSlides[activeIndex];

  if (!active) {
    return null;
  }

  const sectionClass = active.imageOnly
    ? 'relative -mt-14 flex w-full flex-col overflow-hidden bg-[var(--ink)] min-h-[100dvh] lg:-mt-[104px]'
    : 'relative -mt-14 flex min-h-screen flex-col overflow-hidden bg-[var(--ink)] lg:-mt-[104px]'

  return (
    <section className={sectionClass}>
      {!active.imageOnly && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--wine) 0%, var(--ink) 70%)',
          }}
        />
      )}

      {!active.imageOnly && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        {/* Diamond shape rotated 45deg */}
        <rect
          x="300"
          y="300"
          width="200"
          height="200"
          transform="rotate(45 400 400)"
          stroke="var(--gold)"
          strokeWidth="0.5"
        />
        <rect
          x="340"
          y="340"
          width="120"
          height="120"
          transform="rotate(45 400 400)"
          stroke="var(--gold)"
          strokeWidth="0.5"
        />
        {/* Circle */}
        <circle
          cx="400"
          cy="400"
          r="180"
          stroke="var(--gold)"
          strokeWidth="0.5"
        />
        <circle
          cx="400"
          cy="400"
          r="220"
          stroke="var(--gold)"
          strokeWidth="0.3"
        />
        {/* Crosshair lines */}
        <line
          x1="400"
          y1="100"
          x2="400"
          y2="700"
          stroke="var(--gold)"
          strokeWidth="0.3"
        />
        <line
          x1="100"
          y1="400"
          x2="700"
          y2="400"
          stroke="var(--gold)"
          strokeWidth="0.3"
        />
        {/* Diagonal lines */}
        <line
          x1="200"
          y1="200"
          x2="600"
          y2="600"
          stroke="var(--gold)"
          strokeWidth="0.3"
        />
        <line
          x1="600"
          y1="200"
          x2="200"
          y2="600"
          stroke="var(--gold)"
          strokeWidth="0.3"
        />
        </svg>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {active.imageOnly ? (
          <div className="relative h-full w-full">
            {active.backgroundImage?.src ? (
              <Link href={active.primaryCta.href} aria-label={active.primaryCta.label || 'Open'} className="absolute inset-0">
                <Image
                  src={active.backgroundImage.src}
                  alt={active.backgroundImage.alt || 'Hero banner'}
                  fill
                  className={active.objectFit === 'contain' ? 'object-contain' : 'object-cover'}
                  style={active.objectPosition ? { objectPosition: active.objectPosition } : undefined}
                  sizes="100vw"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `rgba(0,0,0,${Math.max(0, Math.min(40, Number(active.overlayOpacity ?? 12))) / 100})` }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.10)' }} />
              </Link>
            ) : null}
            {safeSlides.length > 1 && (
              <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-2">
                {safeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 w-10 rounded-full transition-colors ${
                      idx === activeIndex ? 'bg-[var(--gold)]' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-4 pt-32 text-center sm:pt-36 md:pt-40 lg:pt-52 xl:pt-44">
            <div className="mx-auto w-full max-w-4xl">
              {/* Slide background image */}
              {active.backgroundImage?.src && (
                <div className="absolute inset-x-0 top-0 -z-10">
                  <Image
                    src={active.backgroundImage.src}
                    alt={active.backgroundImage.alt || 'Hero background'}
                    fill
                    className={`${active.objectFit === 'contain' ? 'object-contain' : 'object-cover'} opacity-[0.18]`}
                    style={active.objectPosition ? { objectPosition: active.objectPosition } : undefined}
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-[var(--ink)]/40" />
                </div>
              )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="mb-6">
                  <PromoStrip items={promoItems} />
                </div>

                {/* Eyebrow */}
                <motion.div
                  variants={fadeUp}
                  custom={0}
                  className="flex items-center gap-4"
                >
                  <span className="h-px w-8 bg-[var(--gold)]" />
                  <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
                    {active.eyebrow}
                  </span>
                  <span className="h-px w-8 bg-[var(--gold)]" />
                </motion.div>

                {/* H1 */}
                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="mt-8 font-heading text-5xl font-light leading-tight text-[var(--cream)] sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  {active.title}
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="mt-6 max-w-lg font-heading text-lg italic text-[var(--muted)] md:text-xl"
                >
                  {active.subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                  <Link
                    href={active.primaryCta.href}
                    className="border border-[var(--gold)] bg-[var(--gold)] px-8 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-transparent hover:text-[var(--gold)]"
                  >
                    {active.primaryCta.label}
                  </Link>

                  <Link
                    href={secondaryCtaHref}
                    className="border border-[var(--border-hover)] px-8 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  >
                    {secondaryCtaLabel}
                  </Link>
                </motion.div>

                {/* Dots */}
                {safeSlides.length > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {safeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 w-8 rounded-full transition-colors ${
                          idx === activeIndex ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
        )}

        {!active.imageOnly && (
          <div className="flex shrink-0 flex-col items-center gap-3 pt-10 pb-6 max-xl:pt-14 max-xl:pb-8 xl:pt-12 xl:pb-10">
            <span className="font-accent text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">
              Scroll
            </span>
            <span className="relative h-8 w-px overflow-hidden bg-[var(--border)]">
              <span className="absolute left-0 top-0 h-full w-full animate-scroll-line bg-[var(--gold)]" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
