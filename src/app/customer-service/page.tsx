import Link from 'next/link'

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] px-6 py-24 text-[var(--cream)]">
      <div className="mx-auto max-w-5xl">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Support</p>
        <h1 className="mt-4 font-heading text-5xl font-light">Customer Service</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          We’re here to help with orders, delivery updates, and gifting guidance. For quickest support, contact us with your order ID.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Delivery</p>
            <p className="mt-3 text-sm text-[var(--muted)]">View delivery timelines and default rates.</p>
            <Link href="/delivery" className="mt-5 inline-block text-sm text-[var(--gold)] underline">Delivery info</Link>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Returns</p>
            <p className="mt-3 text-sm text-[var(--muted)]">How returns and issue resolution works.</p>
            <Link href="/returns" className="mt-5 inline-block text-sm text-[var(--gold)] underline">Returns policy</Link>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">FAQ</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Fast answers to common questions.</p>
            <Link href="/faq" className="mt-5 inline-block text-sm text-[var(--gold)] underline">Read FAQ</Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="border border-[var(--gold)] bg-[var(--gold)] px-6 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--gold-light)]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
