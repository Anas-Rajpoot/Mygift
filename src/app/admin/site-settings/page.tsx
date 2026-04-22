'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { fetchCollection, updateItem } from '@/components/admin/admin-api'

type Tab = 'general' | 'contact' | 'social' | 'seo' | 'delivery' | 'home-links' | 'maintenance' | 'domain-payments'

interface SiteSettings {
  id: string
  storeName: string
  storeTagline: string
  logoUrl: string
  faviconUrl: string
  whatsappNumber: string
  whatsappNumber2: string
  supportEmail: string
  supportPhone: string
  supportPhone2: string
  address: string
  city: string
  social: { facebook: string; instagram: string; tiktok: string; pinterest: string; twitter: string }
  seo: { defaultTitle: string; titleSuffix: string; defaultDescription: string; defaultOgImage: string; googleAnalyticsId: string; facebookPixelId: string }
  delivery: { freeDeliveryThreshold: number; defaultSameDayPrice: number; defaultNextDayPrice: number; defaultStandardPrice: number; codAvailable: boolean; codFee: number }
  tax: { enabled: boolean; ratePercent: number; applyToShipping: boolean }
  homeLinks: { shopAllLink: string; saleLink: string; sendToPakistanLink: string; bestsellersLink: string; categoryLinkTemplate: string; occasionLinkTemplate: string }
  maintenance: { maintenanceMode: boolean; maintenanceMessage: string }
  domainPayments: {
    managePaymentsInAdmin: boolean
    primaryDomain: string
    adminDomain: string
    enforceHttps: boolean
    sslEnabled: boolean
    lockAdminByIp: boolean
    adminAllowedIp: string
    webhookSecret: string
    apiSecretKey: string
    stripeEnabled: boolean
    stripePublishableKey: string
    stripeSecretKey: string
    paypalEnabled: boolean
    paypalClientId: string
    paypalClientSecret: string
    wiseEmail: string
  }
}

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'general', label: 'General' }, { id: 'contact', label: 'Contact' }, { id: 'social', label: 'Social' }, { id: 'seo', label: 'SEO' }, { id: 'delivery', label: 'Delivery' }, { id: 'home-links', label: 'Home Links' }, { id: 'maintenance', label: 'Maintenance' }, { id: 'domain-payments', label: 'Domain & Payments' },
]

const fallback: SiteSettings = {
  id: 'main',
  storeName: '', storeTagline: '', logoUrl: '', faviconUrl: '', whatsappNumber: '', whatsappNumber2: '', supportEmail: '', supportPhone: '', supportPhone2: '', address: '', city: '',
  social: { facebook: '', instagram: '', tiktok: '', pinterest: '', twitter: '' },
  seo: { defaultTitle: '', titleSuffix: '', defaultDescription: '', defaultOgImage: '', googleAnalyticsId: '', facebookPixelId: '' },
  delivery: { freeDeliveryThreshold: 0, defaultSameDayPrice: 0, defaultNextDayPrice: 0, defaultStandardPrice: 0, codAvailable: true, codFee: 0 },
  tax: { enabled: false, ratePercent: 0, applyToShipping: false },
  homeLinks: { shopAllLink: '/shop', saleLink: '/shop?on_sale=true', sendToPakistanLink: '/send-to-pakistan', bestsellersLink: '/shop?best_sellers=true', categoryLinkTemplate: '/shop?category={slug}', occasionLinkTemplate: '/occasions?occasion={slug}' },
  maintenance: { maintenanceMode: false, maintenanceMessage: '' },
  domainPayments: {
    managePaymentsInAdmin: false,
    primaryDomain: '',
    adminDomain: '',
    enforceHttps: true,
    sslEnabled: true,
    lockAdminByIp: false,
    adminAllowedIp: '',
    webhookSecret: '',
    apiSecretKey: '',
    stripeEnabled: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalClientSecret: '',
    wiseEmail: '',
  },
}

export default function AdminSiteSettingsPage() {
  const searchParams = useSearchParams()
  const queryTab = searchParams.get('tab')
  const [tab, setTab] = useState<Tab>('general')
  const [form, setForm] = useState<SiteSettings>(fallback)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const tabExists = tabs.some((item) => item.id === queryTab)
    if (queryTab && tabExists) {
      setTab(queryTab as Tab)
    }
  }, [queryTab])

  useEffect(() => {
    fetchCollection<SiteSettings>('site-settings').then((rows) => {
      if (!rows[0]) return
      setForm({
        ...fallback,
        ...rows[0],
        tax: { ...fallback.tax, ...(rows[0] as Partial<SiteSettings>).tax },
        homeLinks: { ...fallback.homeLinks, ...(rows[0] as Partial<SiteSettings>).homeLinks },
        domainPayments: { ...fallback.domainPayments, ...(rows[0] as Partial<SiteSettings>).domainPayments },
      })
    })
  }, [])

  return (
    <div>
      <AdminPageHeader title="Site Settings" />
      <div className="mb-5 flex gap-5 border-b border-[#e8e0d4]">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`pb-2 font-lufga text-sm ${tab === item.id ? 'border-b-2 border-[#c9a84c] font-semibold text-[#1a0c10]' : 'text-[#8a7060]'}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="border border-[#e8e0d4] bg-white p-6">
        {tab === 'general' && (
          <>
            <AdminFormField label="Store Name"><input className={adminInputClass} value={form.storeName} onChange={(e) => setForm((p) => ({ ...p, storeName: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Tagline"><input className={adminInputClass} value={form.storeTagline} onChange={(e) => setForm((p) => ({ ...p, storeTagline: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Logo"><ImageUploader value={form.logoUrl} onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))} /></AdminFormField>
            <AdminFormField label="Favicon"><ImageUploader value={form.faviconUrl} onChange={(url) => setForm((p) => ({ ...p, faviconUrl: url }))} /></AdminFormField>
          </>
        )}
        {tab === 'contact' && (
          <>
            <AdminFormField label="WhatsApp (primary)" hint="Include country code: 923001282333"><input className={adminInputClass} value={form.whatsappNumber} onChange={(e) => setForm((p) => ({ ...p, whatsappNumber: e.target.value }))} /></AdminFormField>
            <AdminFormField label="WhatsApp (secondary)"><input className={adminInputClass} value={form.whatsappNumber2} onChange={(e) => setForm((p) => ({ ...p, whatsappNumber2: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Support Email"><input className={adminInputClass} value={form.supportEmail} onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Support Phone"><input className={adminInputClass} value={form.supportPhone} onChange={(e) => setForm((p) => ({ ...p, supportPhone: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Support Phone 2"><input className={adminInputClass} value={form.supportPhone2} onChange={(e) => setForm((p) => ({ ...p, supportPhone2: e.target.value }))} /></AdminFormField>
            <AdminFormField label="Address"><input className={adminInputClass} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></AdminFormField>
            <AdminFormField label="City"><input className={adminInputClass} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} /></AdminFormField>
          </>
        )}
        {tab === 'social' && (
          <>
            {(['facebook', 'instagram', 'tiktok', 'pinterest', 'twitter'] as const).map((k) => (
              <AdminFormField key={k} label={`${k[0].toUpperCase()}${k.slice(1)} URL`}>
                <input className={adminInputClass} value={form.social[k]} onChange={(e) => setForm((p) => ({ ...p, social: { ...p.social, [k]: e.target.value } }))} />
              </AdminFormField>
            ))}
          </>
        )}
        {tab === 'seo' && (
          <>
            <AdminFormField label="Default Title"><input className={adminInputClass} value={form.seo.defaultTitle} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, defaultTitle: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Title Suffix"><input className={adminInputClass} value={form.seo.titleSuffix} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, titleSuffix: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Default Description"><textarea className={adminInputClass} rows={3} value={form.seo.defaultDescription} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, defaultDescription: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Default OG Image"><ImageUploader value={form.seo.defaultOgImage} onChange={(url) => setForm((p) => ({ ...p, seo: { ...p.seo, defaultOgImage: url } }))} /></AdminFormField>
            <AdminFormField label="Google Analytics ID"><input className={adminInputClass} value={form.seo.googleAnalyticsId} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, googleAnalyticsId: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Facebook Pixel ID"><input className={adminInputClass} value={form.seo.facebookPixelId} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, facebookPixelId: e.target.value } }))} /></AdminFormField>
          </>
        )}
        {tab === 'delivery' && (
          <>
            <AdminFormField label="Free Delivery Threshold (PKR)" hint="Orders above this amount get free standard delivery">
              <input type="number" className={adminInputClass} value={form.delivery.freeDeliveryThreshold} onChange={(e) => setForm((p) => ({ ...p, delivery: { ...p.delivery, freeDeliveryThreshold: Number(e.target.value) } }))} />
            </AdminFormField>
            <div className="grid grid-cols-3 gap-3">
              <AdminFormField label="Same-day Default Price"><input type="number" className={adminInputClass} value={form.delivery.defaultSameDayPrice} onChange={(e) => setForm((p) => ({ ...p, delivery: { ...p.delivery, defaultSameDayPrice: Number(e.target.value) } }))} /></AdminFormField>
              <AdminFormField label="Next-day Default Price"><input type="number" className={adminInputClass} value={form.delivery.defaultNextDayPrice} onChange={(e) => setForm((p) => ({ ...p, delivery: { ...p.delivery, defaultNextDayPrice: Number(e.target.value) } }))} /></AdminFormField>
              <AdminFormField label="Standard Default Price"><input type="number" className={adminInputClass} value={form.delivery.defaultStandardPrice} onChange={(e) => setForm((p) => ({ ...p, delivery: { ...p.delivery, defaultStandardPrice: Number(e.target.value) } }))} /></AdminFormField>
            </div>
            <AdminFormField label="COD Available"><Toggle checked={form.delivery.codAvailable} onChange={(n) => setForm((p) => ({ ...p, delivery: { ...p.delivery, codAvailable: n } }))} /></AdminFormField>
            {form.delivery.codAvailable && <AdminFormField label="COD Fee (PKR)"><input type="number" className={adminInputClass} value={form.delivery.codFee} onChange={(e) => setForm((p) => ({ ...p, delivery: { ...p.delivery, codFee: Number(e.target.value) } }))} /></AdminFormField>}

            <div className="my-6 h-px bg-[#e8e0d4]" />
            <p className="mb-2 font-lufga text-xs tracking-[0.08em] text-[#8a7060]">Tax (optional)</p>
            <AdminFormField label="Enable Tax">
              <Toggle checked={form.tax.enabled} onChange={(n) => setForm((p) => ({ ...p, tax: { ...p.tax, enabled: n } }))} />
            </AdminFormField>
            {form.tax.enabled && (
              <>
                <AdminFormField label="Tax Rate (%)" hint="Example: 18 for 18% tax">
                  <input type="number" className={adminInputClass} value={form.tax.ratePercent} onChange={(e) => setForm((p) => ({ ...p, tax: { ...p.tax, ratePercent: Number(e.target.value) } }))} />
                </AdminFormField>
                <AdminFormField label="Apply Tax to Shipping">
                  <Toggle checked={form.tax.applyToShipping} onChange={(n) => setForm((p) => ({ ...p, tax: { ...p.tax, applyToShipping: n } }))} />
                </AdminFormField>
              </>
            )}
          </>
        )}
        {tab === 'maintenance' && (
          <>
            <AdminFormField label="Maintenance Mode"><Toggle checked={form.maintenance.maintenanceMode} onChange={(n) => setForm((p) => ({ ...p, maintenance: { ...p.maintenance, maintenanceMode: n } }))} /></AdminFormField>
            {form.maintenance.maintenanceMode && (
              <div className="mb-4 border border-[#e05c5c] bg-[rgba(224,92,92,0.1)] p-3 text-sm text-[#9c2b2b]">
                WARNING: Your store is in maintenance mode. Customers cannot access the site.
              </div>
            )}
            <AdminFormField label="Maintenance Message"><textarea rows={3} className={adminInputClass} value={form.maintenance.maintenanceMessage} onChange={(e) => setForm((p) => ({ ...p, maintenance: { ...p.maintenance, maintenanceMessage: e.target.value } }))} /></AdminFormField>
          </>
        )}
        {tab === 'home-links' && (
          <>
            <AdminFormField label="Shop All Link"><input className={adminInputClass} value={form.homeLinks.shopAllLink} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, shopAllLink: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Sale Link"><input className={adminInputClass} value={form.homeLinks.saleLink} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, saleLink: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Send To Pakistan Link"><input className={adminInputClass} value={form.homeLinks.sendToPakistanLink} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, sendToPakistanLink: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Bestsellers Link"><input className={adminInputClass} value={form.homeLinks.bestsellersLink} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, bestsellersLink: e.target.value } }))} /></AdminFormField>
            <AdminFormField label="Category Link Template" hint="Use {slug}, e.g. /shop?category={slug}">
              <input className={adminInputClass} value={form.homeLinks.categoryLinkTemplate} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, categoryLinkTemplate: e.target.value } }))} />
            </AdminFormField>
            <AdminFormField label="Occasion Link Template" hint="Use {slug}, e.g. /occasions?occasion={slug}">
              <input className={adminInputClass} value={form.homeLinks.occasionLinkTemplate} onChange={(e) => setForm((p) => ({ ...p, homeLinks: { ...p.homeLinks, occasionLinkTemplate: e.target.value } }))} />
            </AdminFormField>
          </>
        )}
        {tab === 'domain-payments' && (
          <>
            <p className="mb-4 font-lufga text-xs tracking-[0.08em] text-[#8a7060]">Domain connection and secured payment setup for international customers.</p>
            <AdminFormField label="Manage payments in this admin">
              <Toggle
                checked={form.domainPayments.managePaymentsInAdmin}
                onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, managePaymentsInAdmin: n } }))}
              />
            </AdminFormField>
            {!form.domainPayments.managePaymentsInAdmin && (
              <div className="mb-4 border border-[#e8e0d4] bg-[#f8f6f0] p-3 font-lufga text-xs text-[#6b5c4e]">
                Payments are optional here. You can fully manage payment gateways from WordPress dashboard.
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AdminFormField label="Primary Domain"><input className={adminInputClass} placeholder="mygift.pk" value={form.domainPayments.primaryDomain} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, primaryDomain: e.target.value } }))} /></AdminFormField>
              <AdminFormField label="Admin Domain/Subdomain"><input className={adminInputClass} placeholder="admin.mygift.pk" value={form.domainPayments.adminDomain} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, adminDomain: e.target.value } }))} /></AdminFormField>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AdminFormField label="Force HTTPS"><Toggle checked={form.domainPayments.enforceHttps} onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, enforceHttps: n } }))} /></AdminFormField>
              <AdminFormField label="SSL Enabled"><Toggle checked={form.domainPayments.sslEnabled} onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, sslEnabled: n } }))} /></AdminFormField>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AdminFormField label="Lock Admin by IP"><Toggle checked={form.domainPayments.lockAdminByIp} onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, lockAdminByIp: n } }))} /></AdminFormField>
              <AdminFormField label="Allowed Admin IP" hint="Optional single IP or CIDR"><input className={adminInputClass} placeholder="203.0.113.15" value={form.domainPayments.adminAllowedIp} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, adminAllowedIp: e.target.value } }))} /></AdminFormField>
            </div>

            <AdminFormField label="Webhook Secret (locked)">
              <input type="password" className={adminInputClass} placeholder="whsec_..." value={form.domainPayments.webhookSecret} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, webhookSecret: e.target.value } }))} />
            </AdminFormField>
            <AdminFormField label="API Secret Key (locked)">
              <input type="password" className={adminInputClass} placeholder="Store this like .env secret" value={form.domainPayments.apiSecretKey} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, apiSecretKey: e.target.value } }))} />
            </AdminFormField>

            <p className="mb-2 mt-6 font-lufga text-xs tracking-[0.08em] text-[#8a7060]">Foreign Payment Methods</p>
            <AdminFormField label="Stripe Enabled"><Toggle checked={form.domainPayments.managePaymentsInAdmin && form.domainPayments.stripeEnabled} onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, stripeEnabled: n } }))} disabled={!form.domainPayments.managePaymentsInAdmin} /></AdminFormField>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AdminFormField label="Stripe Publishable Key"><input disabled={!form.domainPayments.managePaymentsInAdmin} className={adminInputClass} placeholder="pk_live_..." value={form.domainPayments.stripePublishableKey} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, stripePublishableKey: e.target.value } }))} /></AdminFormField>
              <AdminFormField label="Stripe Secret Key">
                <input disabled={!form.domainPayments.managePaymentsInAdmin} type="password" className={adminInputClass} placeholder="sk_live_..." value={form.domainPayments.stripeSecretKey} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, stripeSecretKey: e.target.value } }))} />
              </AdminFormField>
            </div>

            <AdminFormField label="PayPal Enabled"><Toggle checked={form.domainPayments.managePaymentsInAdmin && form.domainPayments.paypalEnabled} onChange={(n) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, paypalEnabled: n } }))} disabled={!form.domainPayments.managePaymentsInAdmin} /></AdminFormField>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AdminFormField label="PayPal Client ID"><input disabled={!form.domainPayments.managePaymentsInAdmin} className={adminInputClass} value={form.domainPayments.paypalClientId} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, paypalClientId: e.target.value } }))} /></AdminFormField>
              <AdminFormField label="PayPal Client Secret">
                <input disabled={!form.domainPayments.managePaymentsInAdmin} type="password" className={adminInputClass} value={form.domainPayments.paypalClientSecret} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, paypalClientSecret: e.target.value } }))} />
              </AdminFormField>
            </div>
            <AdminFormField label="Wise Account Email (optional for remittance)">
              <input disabled={!form.domainPayments.managePaymentsInAdmin} className={adminInputClass} value={form.domainPayments.wiseEmail} onChange={(e) => setForm((p) => ({ ...p, domainPayments: { ...p.domainPayments, wiseEmail: e.target.value } }))} />
            </AdminFormField>
          </>
        )}

        <button
          type="button"
          className="mt-6 bg-[#c9a84c] px-6 py-2.5 font-lufga text-sm font-semibold text-[#0f0608]"
          onClick={async () => {
            if (saving) return
            setSaving(true)
            await updateItem<SiteSettings>('site-settings', form.id, form)
            setSaving(false)
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
