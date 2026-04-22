'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';

const countries = [
  'United Kingdom',
  'United States',
  'Canada',
  'UAE',
  'Australia',
  'Europe',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function DiasporaSection({
  eyebrow = 'For the Diaspora',
  title = 'Send your love home to Pakistan',
  body = 'Living in the UK? USA? UAE? Order in minutes, pay in your currency. We deliver to your family in Pakistan.',
  ctaLabel = 'Send a Gift to Pakistan',
  ctaHref = '/send-to-pakistan',
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section
      className="relative overflow-hidden py-24 px-4"
      style={{
        background:
          'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, var(--wine) 60%)',
        backgroundColor: 'var(--wine)',
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:px-8">
        {/* Left: text content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-[var(--gold)]" />
            <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">{eyebrow}</span>
            <span className="h-px w-8 bg-[var(--gold)]" />
          </div>

          <h2 className="mt-6 font-heading text-4xl font-light text-[var(--cream)] md:text-5xl">{title}</h2>

          <p className="mt-6 max-w-md font-heading text-lg italic leading-relaxed text-[var(--cream)] drop-shadow-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
            {body}
          </p>

          {/* Country grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {countries.map((country) => (
              <div
                key={country}
                className="flex items-center gap-2"
              >
                <MapPin size={14} className="text-[var(--gold)]" />
                <span className="font-accent text-xs uppercase tracking-wider text-[var(--gold-light)]">
                  {country}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 bg-[var(--gold)] px-8 py-3.5 font-accent text-sm uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)] sm:text-base"
          >
            {ctaLabel}
            <ChevronRight size={18} className="shrink-0" />
          </Link>
        </motion.div>

        {/* Right: Globe SVG */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="flex items-center justify-center"
        >
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"
          >
            {/* Outer circle (globe) */}
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke="var(--gold)"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <circle
              cx="200"
              cy="200"
              r="160"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
            />

            {/* Latitude lines (arcs) */}
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="60"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="120"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
            />
            <ellipse
              cx="200"
              cy="160"
              rx="170"
              ry="40"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.15"
            />
            <ellipse
              cx="200"
              cy="240"
              rx="170"
              ry="40"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.15"
            />

            {/* Longitude lines (arcs) */}
            <ellipse
              cx="200"
              cy="200"
              rx="60"
              ry="180"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="120"
              ry="180"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.2"
            />

            {/* Vertical and horizontal center lines */}
            <line
              x1="200"
              y1="20"
              x2="200"
              y2="380"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.15"
            />
            <line
              x1="20"
              y1="200"
              x2="380"
              y2="200"
              stroke="var(--gold)"
              strokeWidth="0.3"
              opacity="0.15"
            />

            {/* Pakistan highlighted dot */}
            <circle cx="265" cy="170" r="6" fill="var(--gold)" opacity="0.9" />
            <circle cx="265" cy="170" r="12" stroke="var(--gold)" strokeWidth="0.5" opacity="0.4" />
            <circle cx="265" cy="170" r="20" stroke="var(--gold)" strokeWidth="0.3" opacity="0.2" />

            {/* Connection lines from other countries to Pakistan */}
            {/* UK */}
            <circle cx="165" cy="145" r="3" fill="var(--gold)" opacity="0.4" />
            <line x1="165" y1="145" x2="265" y2="170" stroke="var(--gold)" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 4" />

            {/* USA */}
            <circle cx="95" cy="165" r="3" fill="var(--gold)" opacity="0.4" />
            <line x1="95" y1="165" x2="265" y2="170" stroke="var(--gold)" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 4" />

            {/* UAE */}
            <circle cx="250" cy="195" r="3" fill="var(--gold)" opacity="0.4" />
            <line x1="250" y1="195" x2="265" y2="170" stroke="var(--gold)" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
