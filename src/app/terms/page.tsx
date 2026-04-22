export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] px-6 py-24 text-[var(--cream)]">
      <div className="mx-auto max-w-4xl">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Legal</p>
        <h1 className="mt-4 font-heading text-5xl font-light">Terms of Service</h1>
        <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
          By using MyGift.pk, you agree to the terms below. For delivery and returns details, see the linked pages.
        </p>

        <div className="mt-10 space-y-4">
          {[
            { t: 'Ordering', b: 'Please ensure billing and delivery details are accurate. Order updates are sent to the email you provide.' },
            { t: 'Delivery', b: 'Delivery timelines depend on city and product availability. Delivery charges are shown at checkout.' },
            { t: 'Payments', b: 'Payments are handled through your WooCommerce gateways (and COD where available).' },
            { t: 'Returns', b: 'If you receive a damaged or incorrect item, contact support promptly with photos and your order ID.' },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">{s.t}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
