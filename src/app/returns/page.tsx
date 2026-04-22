import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <div className="bg-[var(--ink)]">
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Policies</p>
        <h1 className="mt-4 font-heading text-4xl font-light text-[var(--cream)] md:text-5xl">Returns & Refunds</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          We aim for a flawless gifting experience. If something isn’t right, contact us as soon as possible and we’ll make it right.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">What we can help with</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              <li>Damaged items on arrival</li>
              <li>Wrong item delivered</li>
              <li>Quality issues reported promptly</li>
              <li>Delivery issues (where applicable)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">How to request support</p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Share your order ID, a short description, and photos (if needed). Our team will respond with next steps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="border border-[var(--gold)] bg-[var(--gold)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--gold-light)]"
              >
                Contact support
              </Link>
              <Link
                href="/terms"
                className="border border-[var(--border-hover)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

