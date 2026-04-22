export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] px-6 py-24 text-[var(--cream)]">
      <div className="mx-auto max-w-4xl">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Legal</p>
        <h1 className="mt-4 font-heading text-5xl font-light">Privacy Policy</h1>
        <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
          We respect your privacy. We use your information to process orders, provide support, and improve your experience.
        </p>

        <div className="mt-10 space-y-4">
          {[
            { t: 'What we collect', b: 'Contact details, delivery details, and order information needed to fulfill your purchase.' },
            { t: 'How we use it', b: 'To process payments (via WooCommerce gateways), fulfill deliveries, send order updates, and provide customer support.' },
            { t: 'Marketing emails', b: 'If you subscribe, we may send occasional updates. You can unsubscribe anytime.' },
            { t: 'Data sharing', b: 'We only share information with service providers necessary to fulfill your order (e.g., payment and delivery partners).' },
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
