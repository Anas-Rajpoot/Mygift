'use client'

import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { fetchCollection, updateItem } from '@/components/admin/admin-api'

interface SendToPakistanConfig {
  id: string
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroBannerImageUrl: string
  heroMobileBannerUrl: string
  featuredCountries: Array<{ name: string; currency: string; symbol: string; flagEmoji: string }>
  promoText: string
  promoImageUrl: string
  seoTitle: string
  seoDescription: string
  isActive: boolean
}

const fallback: SendToPakistanConfig = {
  id: 'main',
  heroTitle: '',
  heroSubtitle: '',
  heroCtaText: '',
  heroBannerImageUrl: '',
  heroMobileBannerUrl: '',
  featuredCountries: [],
  promoText: '',
  promoImageUrl: '',
  seoTitle: '',
  seoDescription: '',
  isActive: true,
}

export default function AdminSendToPakistanPage() {
  const [form, setForm] = useState<SendToPakistanConfig>(fallback)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCollection<SendToPakistanConfig>('send-to-pakistan').then((items) => {
      if (items[0]) setForm(items[0])
    })
  }, [])

  return (
    <div>
      <AdminPageHeader title="Send to Pakistan" />
      <div className="border border-[#e8e0d4] bg-white p-6">
        <h2 className="mb-4 font-lufga text-lg text-[#1a0c10]">Hero Content</h2>
        <AdminFormField label="Hero Title"><textarea rows={2} className={adminInputClass} value={form.heroTitle} onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Hero Subtitle"><textarea rows={2} className={adminInputClass} value={form.heroSubtitle} onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))} /></AdminFormField>
        <AdminFormField label="CTA Button Text"><input className={adminInputClass} value={form.heroCtaText} onChange={(e) => setForm((p) => ({ ...p, heroCtaText: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Desktop Banner"><ImageUploader value={form.heroBannerImageUrl} onChange={(url) => setForm((p) => ({ ...p, heroBannerImageUrl: url }))} /></AdminFormField>
        <AdminFormField label="Mobile Banner"><ImageUploader value={form.heroMobileBannerUrl} onChange={(url) => setForm((p) => ({ ...p, heroMobileBannerUrl: url }))} /></AdminFormField>

        <h2 className="mb-4 mt-8 font-lufga text-lg text-[#1a0c10]">Featured Countries</h2>
        <div className="space-y-2">
          {form.featuredCountries.map((country, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input className={`${adminInputClass} col-span-4`} value={country.name} onChange={(e) => setForm((p) => ({ ...p, featuredCountries: p.featuredCountries.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) }))} />
              <input className={`${adminInputClass} col-span-3`} value={country.currency} onChange={(e) => setForm((p) => ({ ...p, featuredCountries: p.featuredCountries.map((x, idx) => idx === i ? { ...x, currency: e.target.value } : x) }))} />
              <input className={`${adminInputClass} col-span-2`} value={country.symbol} onChange={(e) => setForm((p) => ({ ...p, featuredCountries: p.featuredCountries.map((x, idx) => idx === i ? { ...x, symbol: e.target.value } : x) }))} />
              <input className={`${adminInputClass} col-span-2`} value={country.flagEmoji} onChange={(e) => setForm((p) => ({ ...p, featuredCountries: p.featuredCountries.map((x, idx) => idx === i ? { ...x, flagEmoji: e.target.value } : x) }))} />
              <button type="button" className="col-span-1 text-[#e05c5c]" onClick={() => setForm((p) => ({ ...p, featuredCountries: p.featuredCountries.filter((_, idx) => idx !== i) }))}><X size={16} /></button>
            </div>
          ))}
          <button type="button" className="flex items-center gap-1 text-sm text-[#c9a84c]" onClick={() => setForm((p) => ({ ...p, featuredCountries: [...p.featuredCountries, { name: '', currency: '', symbol: '', flagEmoji: '' }] }))}><Plus size={14} />Add Country</button>
        </div>

        <h2 className="mb-4 mt-8 font-lufga text-lg text-[#1a0c10]">Promotional Section</h2>
        <AdminFormField label="Promo Text"><textarea rows={3} className={adminInputClass} value={form.promoText} onChange={(e) => setForm((p) => ({ ...p, promoText: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Promo Image"><ImageUploader value={form.promoImageUrl} onChange={(url) => setForm((p) => ({ ...p, promoImageUrl: url }))} /></AdminFormField>
        <AdminFormField label="SEO Title"><input className={adminInputClass} value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} /></AdminFormField>
        <AdminFormField label="SEO Description"><textarea rows={2} className={adminInputClass} value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={form.isActive} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} /></AdminFormField>

        <button
          type="button"
          className="mt-4 bg-[#c9a84c] px-5 py-2.5 font-lufga text-sm font-semibold text-[#0f0608]"
          onClick={async () => {
            setSaving(true)
            await updateItem<SendToPakistanConfig>('send-to-pakistan', form.id, form)
            setSaving(false)
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
