'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Gift,
  Truck,
  Shield,
  Clock,
  CreditCard,
  Users,
  MapPin,
  Globe,
  ShoppingBag,
  Package,
  Sparkles,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const viewport = { once: true, margin: '-80px' as const };

const stats = [
  { number: '50+', label: 'Cities Delivered', icon: MapPin },
  { number: '10,000+', label: 'Happy Customers', icon: Users },
  { number: '15+', label: 'Countries Served', icon: Globe },
  { number: '5', label: 'Gift Categories', icon: ShoppingBag },
];

const steps = [
  {
    step: '01',
    title: 'Browse & Select',
    description:
      'Explore our curated collections of premium gifts, hampers, flowers, clothing, and accessories.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Choose Delivery Details',
    description:
      "Select your recipient's city in Pakistan, pick a delivery date, and add a personal message.",
    icon: Package,
  },
  {
    step: '03',
    title: 'We Deliver With Care',
    description:
      'Our local team hand-delivers your gift with premium packaging. Same-day delivery available.',
    icon: Truck,
  },
];

const values = [
  {
    title: 'Quality Curated',
    description:
      'Every product is hand-picked and quality-checked before it reaches your loved ones.',
    icon: Gift,
  },
  {
    title: 'Same-Day Delivery',
    description:
      'Order before 2 PM PKT and we deliver the same day across all major Pakistani cities.',
    icon: Clock,
  },
  {
    title: 'Secure Payments',
    description:
      'Pay in USD, GBP, AED, or PKR with fully encrypted checkout. Your data is always safe.',
    icon: CreditCard,
  },
  {
    title: 'Customer First',
    description:
      'Dedicated WhatsApp support, real-time tracking, and a satisfaction guarantee on every order.',
    icon: Shield,
  },
];

const cities = [
  'Multan', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi',
  'Faisalabad', 'Peshawar', 'Sialkot', 'Gujranwala', 'Hyderabad',
  'Quetta', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Mardan', 'Sukkur',
];

export function AboutContent() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[var(--ink)]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--wine) 0%, var(--ink) 70%)',
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          viewBox="0 0 800 800"
          fill="none"
        >
          <circle cx="400" cy="400" r="200" stroke="var(--gold)" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="280" stroke="var(--gold)" strokeWidth="0.3" />
          <rect
            x="320" y="320" width="160" height="160"
            transform="rotate(45 400 400)"
            stroke="var(--gold)" strokeWidth="0.5"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 text-center lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--gold)]" />
              <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
                Our Story
              </span>
              <span className="h-px w-8 bg-[var(--gold)]" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-8 font-heading text-4xl font-light leading-tight text-[var(--cream)] sm:text-5xl md:text-6xl"
            >
              Bridging Hearts{' '}
              <em className="text-[var(--gold)]">Across Borders</em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg font-heading text-lg italic text-[var(--muted)] md:text-xl"
            >
              From the UK, USA, and UAE — sending love home to Pakistan, one
              curated gift at a time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={stagger}
            >
              <motion.span
                variants={fadeUp}
                className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]"
              >
                Our Mission
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-4 font-heading text-3xl font-light text-[var(--cream)] lg:text-4xl"
              >
                Distance should never stop you from showing love
              </motion.h2>
              <motion.div variants={fadeUp} className="mt-2 h-px w-16 bg-[var(--gold)]" />
              <motion.p
                variants={fadeUp}
                className="mt-6 leading-relaxed text-[var(--muted)]"
              >
                MyGift.pk was born in Multan with a simple idea: millions of
                Pakistanis living abroad miss birthdays, anniversaries, Eid
                celebrations, and everyday moments with their families back
                home. We exist to bridge that gap.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-4 leading-relaxed text-[var(--muted)]"
              >
                We curate premium gifts across five categories — Gift Hampers,
                Clothing & Fashion, Watches & Accessories, Digital Products,
                and Flowers & Cakes — so you can send the perfect surprise to
                any city in Pakistan, in any currency you prefer.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <div className="h-72 w-72 border border-[var(--border)] lg:h-80 lg:w-80" />
                <div className="absolute inset-4 border border-[var(--border-hover)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-[var(--gold)] opacity-40" strokeWidth={0.8} />
                </div>
                <div className="absolute -right-3 -top-3 h-6 w-6 bg-[var(--gold)]" />
                <div className="absolute -bottom-3 -left-3 h-6 w-6 bg-[var(--gold)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <stat.icon className="mx-auto mb-4 h-6 w-6 text-[var(--gold)] opacity-60" strokeWidth={1.2} />
                <p className="font-heading text-4xl font-light text-[var(--gold)] lg:text-5xl">
                  {stat.number}
                </p>
                <p className="mt-2 font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="text-center"
          >
            <motion.span variants={fadeUp} className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-heading text-3xl font-light text-[var(--cream)] lg:text-4xl">
              Three simple steps to send love home
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {steps.map((step) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className="group border border-[var(--border)] p-8 transition-colors hover:border-[var(--gold)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                    Step {step.step}
                  </span>
                  <step.icon className="h-6 w-6 text-[var(--muted)] transition-colors group-hover:text-[var(--gold)]" strokeWidth={1.2} />
                </div>
                <h3 className="mt-6 font-heading text-2xl text-[var(--cream)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="text-center"
          >
            <motion.span variants={fadeUp} className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
              Why MyGift.pk
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-heading text-3xl font-light text-[var(--cream)] lg:text-4xl">
              Built on trust, delivered with care
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                className="group border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--gold)]"
              >
                <value.icon className="h-8 w-8 text-[var(--gold)]" strokeWidth={1} />
                <h3 className="mt-5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Delivery Cities ── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="text-center"
          >
            <motion.span variants={fadeUp} className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
              We Deliver To
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-heading text-3xl font-light text-[var(--cream)] lg:text-4xl">
              Across Pakistan, with love
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {cities.map((city) => (
              <motion.span
                key={city}
                variants={fadeUp}
                className="border border-[var(--border)] px-5 py-2 font-accent text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                {city}
              </motion.span>
            ))}
            <motion.span
              variants={fadeUp}
              className="border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-5 py-2 font-accent text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]"
            >
              &amp; Many More
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[var(--ink)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--wine) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--gold)]" />
              <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
                Get Started
              </span>
              <span className="h-px w-8 bg-[var(--gold)]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-8 font-heading text-3xl font-light text-[var(--cream)] sm:text-4xl lg:text-5xl"
            >
              Ready to send love home?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-md font-heading text-lg italic text-[var(--muted)]"
            >
              Browse our curated collections and surprise your loved ones in
              Pakistan today.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/shop"
                className="bg-[var(--gold)] px-8 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)]"
              >
                Shop Now
              </Link>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--border-hover)] px-8 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
