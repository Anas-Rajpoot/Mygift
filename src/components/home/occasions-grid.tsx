'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cake, Heart, Sparkles, Star, Flower2 } from 'lucide-react';

type OccasionItem = {
  name?: string;
  count?: number;
  href?: string;
  bg?: string;
  iconKey?: 'cake' | 'heart' | 'sparkles' | 'star' | 'flower2';
};

const defaultOccasions: OccasionItem[] = [
  { name: 'Birthday', count: 86, iconKey: 'cake', bg: '#4a1525', href: '/occasions?occasion=birthday' },
  { name: 'Anniversary', count: 42, iconKey: 'heart', bg: '#241318', href: '/occasions?occasion=anniversary' },
  { name: 'Wedding', count: 64, iconKey: 'sparkles', bg: '#3d1120', href: '/occasions?occasion=wedding' },
  { name: 'Eid', count: 78, iconKey: 'star', bg: '#1f1015', href: '/occasions?occasion=eid' },
  { name: "Mother's Day", count: 35, iconKey: 'flower2', bg: '#1a0c10', href: '/occasions?occasion=mothers-day' },
  { name: "Valentine's Day", count: 54, iconKey: 'heart', bg: '#4a1525', href: '/occasions?occasion=valentines-day' },
];

const iconMap: Record<string, typeof Cake> = {
  cake: Cake,
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  flower2: Flower2,
};

const iconFallbackByIndex = [Cake, Heart, Sparkles, Star, Flower2, Heart];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function OccasionsGrid({ occasions, occasionLinkTemplate = '/occasions?occasion={slug}' }: { occasions?: OccasionItem[]; occasionLinkTemplate?: string }) {
  const safeOccasions = occasions && occasions.length ? occasions : defaultOccasions;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
          Gifting
        </span>
        <h2 className="mt-3 font-heading text-3xl font-light text-[var(--cream)] md:text-4xl">
          Shop by Occasion
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {safeOccasions.slice(0, 6).map((occ, i) => {
          const Icon =
            (occ.iconKey && iconMap[occ.iconKey]) || iconFallbackByIndex[i % iconFallbackByIndex.length];
          return (
            <motion.div
              key={occ.name || i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <Link
                href={occ.href || occasionLinkTemplate.replace('{slug}', encodeURIComponent((occ.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')))}
                prefetch={false}
                aria-label={occ.name || 'Occasion'}
              >
                <motion.div
                  whileHover={{ filter: 'brightness(1.15)' }}
                  transition={{ duration: 0.25 }}
                  className="relative min-h-[180px] overflow-hidden p-8"
                  style={{ backgroundColor: occ.bg || '#2b2b2b' }}
                >
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                    <Icon
                      size={24}
                      className="text-[var(--gold)]"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  <h3 className="mt-4 font-heading text-xl text-[var(--cream)]">{occ.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {occ.count ?? 0} gifts
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
