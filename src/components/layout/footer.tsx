import Link from 'next/link';
import { readDb } from '@/lib/db';
import { FooterNewsletterForm } from '@/components/layout/FooterNewsletterForm'
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
} from 'lucide-react';

interface FooterLinkItem {
  id: string;
  section: 'shop' | 'company';
  name: string;
  href: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface FooterPaymentItem {
  id: string;
  name: string;
  isActive?: boolean;
  sortOrder?: number;
}

const fallbackShopLinks = [{ name: 'All Products', href: '/shop' }];
const fallbackCompanyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms' },
];
const fallbackPayments = ['JazzCash', 'EasyPaisa', 'Visa', 'Mastercard'];

export function Footer() {
  const siteSettings = readDb<{
    whatsappNumber?: string;
    supportEmail?: string;
    supportPhone?: string;
    address?: string;
    city?: string;
    social?: { facebook?: string; instagram?: string; tiktok?: string };
  }>('site-settings')[0] || {};
  const whatsapp = siteSettings.whatsappNumber || '923001234567';
  const supportEmail = siteSettings.supportEmail || 'hello@mygift.pk';
  const supportPhone = siteSettings.supportPhone || '+92 300 1234567';
  const location = [siteSettings.city, siteSettings.address].filter(Boolean).join(', ') || 'Multan, Punjab, Pakistan';

  const footerLinks = readDb<FooterLinkItem>('footer-links');
  const footerPayments = readDb<FooterPaymentItem>('footer-payments');

  const shopLinks = footerLinks
    .filter((item) => item.section === 'shop' && item.isActive !== false)
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999))
    .map((item) => ({ name: item.name, href: item.href }));
  const companyLinks = footerLinks
    .filter((item) => item.section === 'company' && item.isActive !== false)
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999))
    .map((item) => ({ name: item.name, href: item.href }));
  const paymentMethods = footerPayments
    .filter((item) => item.isActive !== false)
    .sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999))
    .map((item) => item.name);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      {/* Newsletter */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="font-heading text-2xl font-light text-[var(--cream)]">
              Join the inner circle
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Exclusive offers, new arrivals, and gifting inspiration
              delivered to your inbox.
            </p>
            <FooterNewsletterForm />
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-accent text-lg tracking-[0.1em] text-[var(--gold)]">
                MyGift
              </span>
              <span className="font-heading text-lg italic text-[var(--cream)]">
                .pk
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Pakistan&apos;s premier destination for luxury gifting. Curated
              gifts delivered with care across the nation.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Shop
            </h4>
            <ul className="mt-4 space-y-3">
              {(shopLinks.length ? shopLinks : fallbackShopLinks).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {(companyLinks.length ? companyLinks : fallbackCompanyLinks).map((link) => (
                <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                    >
                      {link.name}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                >
                  <Mail size={14} />
                  {supportEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${supportPhone}`}
                  className="flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
                >
                  <Phone size={14} />
                  {supportPhone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--muted)]">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment badges */}
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-8">
          <span className="text-sm text-[var(--muted)] mr-2 sm:text-base">We accept:</span>
          {(paymentMethods.length ? paymentMethods : fallbackPayments).map((method) => (
            <span
              key={method}
              className="border border-[var(--border)] px-3 py-1.5 font-accent text-xs uppercase tracking-wider text-[var(--muted)] sm:px-4 sm:text-sm"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Social icons */}
        <div className="mt-6 flex items-center gap-4">
          <a
            href={siteSettings.social?.facebook || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href={siteSettings.social?.instagram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href={siteSettings.social?.tiktok || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
            aria-label="TikTok"
          >
            <span className="font-accent text-[10px] uppercase tracking-wider">
              TikTok
            </span>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <p className="text-center font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            &copy; {new Date().getFullYear()} MYGIFT.PK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
