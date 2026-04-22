import Link from 'next/link'
import { readDb } from '@/lib/db'

export default function DeliveryPage() {
  const settings = readDb<{
    delivery?: {
      freeDeliveryThreshold?: number
      defaultSameDayPrice?: number
      defaultNextDayPrice?: number
      defaultStandardPrice?: number
      codAvailable?: boolean
      codFee?: number
    }
    supportEmail?: string
    whatsappNumber?: string
  }>('site-settings')[0]

  const d = settings?.delivery
  const whatsapp = settings?.whatsappNumber || '923001234567'

  return (
    <div className="bg-[var(--ink)]">
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Support</p>
        <h1 className="mt-4 font-heading text-4xl font-light text-[var(--cream)] md:text-5xl">Delivery</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Delivery timelines and charges depend on your city and the items in your cart. Below are our default rates (admin-configurable).
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Default rates</p>
            <div className="mt-4 space-y-2 text-sm text-[var(--cream)]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Standard</span>
                <span>Rs {Number(d?.defaultStandardPrice || 0).toLocaleString('en-PK')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Next-day</span>
                <span>Rs {Number(d?.defaultNextDayPrice || 0).toLocaleString('en-PK')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Same-day</span>
                <span>Rs {Number(d?.defaultSameDayPrice || 0).toLocaleString('en-PK')}</span>
              </div>
              <div className="mt-4 border-t border-[var(--border)] pt-4 flex items-center justify-between">
                <span className="text-[var(--muted)]">Free standard over</span>
                <span>Rs {Number(d?.freeDeliveryThreshold || 0).toLocaleString('en-PK')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Cash on Delivery</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {d?.codAvailable ? 'COD is available in selected cities.' : 'COD is currently unavailable.'}
            </p>
            {d?.codAvailable ? (
              <p className="mt-3 text-sm text-[var(--cream)]">
                COD fee: <span className="text-[var(--gold)]">Rs {Number(d?.codFee || 0).toLocaleString('en-PK')}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--border-hover)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                WhatsApp support
              </a>
              <Link
                href="/faq"
                className="border border-[var(--gold)] bg-[var(--gold)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--gold-light)]"
              >
                Read FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

