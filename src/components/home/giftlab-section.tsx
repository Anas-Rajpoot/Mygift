'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const steps = [
  { numeral: 'I', label: 'Choose your box' },
  { numeral: 'II', label: 'Select items' },
  { numeral: 'III', label: 'Add a ribbon' },
  { numeral: 'IV', label: 'Write a message' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function GiftLabSection({
  eyebrow = 'Exclusive',
  title = 'GiftLab',
  description = 'Design your perfect gift. Choose a box, pick items, add a ribbon and personal message.',
  ctaLabel = 'Start Creating',
  ctaHref = '/giftlab',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Left: abstract SVG illustration */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="flex items-center justify-center bg-[var(--surface)] p-12 lg:aspect-square"
        >
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full max-h-80"
          >
            {/* Gift box base */}
            <rect
              x="100"
              y="200"
              width="200"
              height="140"
              stroke="var(--gold)"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Gift box lid */}
            <rect
              x="80"
              y="170"
              width="240"
              height="40"
              stroke="var(--gold)"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Vertical ribbon */}
            <line
              x1="200"
              y1="60"
              x2="200"
              y2="340"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Horizontal ribbon */}
            <line
              x1="100"
              y1="270"
              x2="300"
              y2="270"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Bow - left loop */}
            <ellipse
              cx="175"
              cy="145"
              rx="30"
              ry="20"
              stroke="var(--gold)"
              strokeWidth="0.8"
              opacity="0.5"
              transform="rotate(-20 175 145)"
            />
            {/* Bow - right loop */}
            <ellipse
              cx="225"
              cy="145"
              rx="30"
              ry="20"
              stroke="var(--gold)"
              strokeWidth="0.8"
              opacity="0.5"
              transform="rotate(20 225 145)"
            />
            {/* Bow center */}
            <circle
              cx="200"
              cy="155"
              r="8"
              stroke="var(--gold)"
              strokeWidth="0.8"
              opacity="0.6"
            />
            {/* Assembly lines - floating elements going into box */}
            <rect
              x="130"
              y="90"
              width="20"
              height="20"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="3 3"
            />
            <circle
              cx="270"
              cy="100"
              r="10"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="3 3"
            />
            <rect
              x="250"
              y="80"
              width="15"
              height="25"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="3 3"
              transform="rotate(15 257 92)"
            />
            {/* Motion lines */}
            <line
              x1="140"
              y1="110"
              x2="160"
              y2="170"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
              strokeDasharray="2 4"
            />
            <line
              x1="260"
              y1="110"
              x2="240"
              y2="170"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
              strokeDasharray="2 4"
            />
          </svg>
        </motion.div>

        {/* Right: content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="flex flex-col justify-center"
        >
          <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">{eyebrow}</span>

          <h2 className="mt-4 font-heading text-5xl font-light text-[var(--cream)]">{title}</h2>

          <p className="mt-4 max-w-md text-[var(--muted)]">{description}</p>

          {/* Steps */}
          <div className="mt-8 space-y-4">
            {steps.map((step) => (
              <div key={step.numeral} className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center border border-[var(--gold)] font-accent text-xs text-[var(--gold)]">
                  {step.numeral}
                </span>
                <span className="text-[var(--cream)]">{step.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="mt-10 inline-flex w-fit bg-[var(--gold)] px-8 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)]"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
