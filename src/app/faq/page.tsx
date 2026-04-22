const faqs = [
  { q: 'Do you offer same-day delivery?', a: 'Yes, same-day delivery is available in selected major cities depending on cutoff time and product availability.' },
  { q: 'How do I choose delivery speed?', a: 'At checkout, select Standard, Next-day, or Same-day. Charges are shown clearly before you place your order.' },
  { q: 'Can I customize my gift?', a: 'Yes — use GiftLab to build a personalized gift box with add-ons and a message card.' },
  { q: 'Which payment methods are accepted?', a: 'Payment methods depend on your WooCommerce gateway setup. If COD is available, you’ll see it at checkout.' },
  { q: 'Can I send gifts from abroad?', a: 'Yes. You can order from anywhere and deliver across Pakistan.' },
  { q: 'What if something arrives damaged?', a: 'Contact support with your order ID and photos. We’ll review and resolve quickly.' },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] px-6 py-24 text-[var(--cream)]">
      <div className="mx-auto max-w-4xl">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Help Center</p>
        <h1 className="mt-4 font-heading text-5xl font-light">Frequently Asked Questions</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">Quick answers about delivery, payments, customization, and support.</p>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="font-heading text-lg font-light">{item.q}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
