import { readDb } from '@/lib/db'
import { FooterNewsletterForm } from '@/components/layout/FooterNewsletterForm'
import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
  const settings = readDb<{
    whatsappNumber?: string
    supportEmail?: string
    supportPhone?: string
    supportPhone2?: string
    address?: string
    city?: string
  }>('site-settings')[0] || {}

  const whatsapp = settings.whatsappNumber || '923001234567'
  const location = [settings.city, settings.address].filter(Boolean).join(', ') || 'Pakistan'

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <p className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">Get in touch</p>
        <h1 className="mt-4 font-heading text-4xl font-light text-[var(--cream)] md:text-5xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Need help with an order, delivery timing, or choosing the perfect gift? Send a message and our team will respond.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:col-span-7">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Message</p>
            <ContactForm />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:col-span-5">
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <p className="text-[var(--cream)]">{settings.supportPhone || '0300-1282333'}</p>
              {settings.supportPhone2 ? <p className="text-[var(--cream)]">{settings.supportPhone2}</p> : null}
              <p className="text-[var(--gold)]">{settings.supportEmail || 'support@mygift.pk'}</p>
              <p>{location}</p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex border border-[var(--border-hover)] px-5 py-2.5 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                WhatsApp support
              </a>
            </div>

            <div className="mt-10 border-t border-[var(--border)] pt-6">
              <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">Newsletter</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Exclusive offers and new arrivals.</p>
              <FooterNewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
