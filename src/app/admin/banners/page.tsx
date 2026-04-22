'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface Banner {
  id: string
  type: 'hero' | 'promo' | 'occasion' | 'send-to-pakistan'
  imageOnly?: boolean
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  overlayOpacity?: number
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  imageUrl: string
  mobileImageUrl?: string
  isActive: boolean
  sortOrder: number
  backgroundColor?: string
  textColor?: string
  badgeText?: string
  startDate?: string
  endDate?: string
}

const emptyForm: Partial<Banner> = { type: 'hero', isActive: true, sortOrder: 1, backgroundColor: '#1a0c10', textColor: '#fdf4e8', objectFit: 'cover', objectPosition: 'center', overlayOpacity: 12 }

export default function AdminBannersPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<Banner>('banners')
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'all' | Banner['type']>('all')
  const [form, setForm] = useState<Partial<Banner>>(emptyForm)

  const filtered = useMemo(() => (tab === 'all' ? data : data.filter((item) => item.type === tab)), [data, tab])

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        onAdd={() => {
          setForm(emptyForm)
          setOpen(true)
        }}
        addLabel="Add Banner"
      />

      <div className="mb-5 flex gap-4 border-b border-[#e8e0d4]">
        {(['all', 'hero', 'promo', 'occasion', 'send-to-pakistan'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`pb-2 font-lufga text-sm ${tab === item ? 'border-b-2 border-[#c9a84c] text-[#1a0c10]' : 'text-[#8a7060]'}`}
          >
            {item === 'all' ? 'All' : item}
          </button>
        ))}
      </div>
      {tab === 'hero' && (
        <div className="mb-5 border border-[#e8e0d4] bg-white p-4 font-lufga text-xs text-[#6b5c4e]">
          Hero banners are your <b>3 homepage slides</b>. Add up to 3 active items (Type: hero) and control order via <b>Sort Order</b> (1,2,3).
        </div>
      )}

      <AdminTable
        columns={[
          {
            key: 'imageUrl',
            label: 'Preview',
            render: (val) =>
              val ? <Image src={String(val)} alt="banner" width={60} height={40} className="h-10 w-[60px] object-cover" /> : <div className="h-10 w-[60px] bg-[#f2e9dd]" />,
          },
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          {
            key: 'isActive',
            label: 'Status',
            render: (_, row) => (
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${row.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                {row.isActive ? 'Active' : 'Inactive'}
              </div>
            ),
          },
          { key: 'sortOrder', label: 'Sort' },
        ]}
        data={filtered}
        loading={loading}
        onEdit={(item) => {
          setForm(item)
          setOpen(true)
        }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={form.id ? 'Edit Banner' : 'Add Banner'}
        saving={saving}
        onSave={async () => {
          await save(form)
          setOpen(false)
        }}
      >
        <AdminFormField label="Banner Type" required>
          <select className={adminInputClass} value={form.type ?? 'hero'} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Banner['type'] }))}>
            <option value="hero">hero</option>
            <option value="promo">promo</option>
            <option value="occasion">occasion</option>
            <option value="send-to-pakistan">send-to-pakistan</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Title" required>
          <input className={adminInputClass} value={form.title ?? ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Subtitle">
          <textarea className={adminInputClass} rows={2} value={form.subtitle ?? ''} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Hero Image Only (no text)">
          <Toggle checked={Boolean(form.imageOnly)} onChange={(next) => setForm((p) => ({ ...p, imageOnly: next }))} />
          <p className="mt-1 font-lufga text-xs text-[#8a7060]">If enabled, the homepage hero becomes a full-screen image banner and hides all text.</p>
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Image Fit">
            <select className={adminInputClass} value={form.objectFit ?? 'cover'} onChange={(e) => setForm((p) => ({ ...p, objectFit: e.target.value as Banner['objectFit'] }))}>
              <option value="cover">cover</option>
              <option value="contain">contain</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Image Position">
            <select className={adminInputClass} value={form.objectPosition ?? 'center'} onChange={(e) => setForm((p) => ({ ...p, objectPosition: e.target.value }))}>
              <option value="center">center</option>
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="top left">top left</option>
              <option value="top right">top right</option>
              <option value="bottom left">bottom left</option>
              <option value="bottom right">bottom right</option>
            </select>
          </AdminFormField>
        </div>
        <AdminFormField label="Overlay (0–40%)" hint="Luxury dark overlay for brand theme. Use 0 for pure image.">
          <input
            type="number"
            min={0}
            max={40}
            className={adminInputClass}
            value={form.overlayOpacity ?? 12}
            onChange={(e) => setForm((p) => ({ ...p, overlayOpacity: Number(e.target.value || 0) }))}
          />
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="CTA Button Text">
            <input className={adminInputClass} value={form.ctaText ?? ''} onChange={(e) => setForm((p) => ({ ...p, ctaText: e.target.value }))} />
          </AdminFormField>
          <AdminFormField label="CTA Link">
            <input className={adminInputClass} value={form.ctaLink ?? ''} onChange={(e) => setForm((p) => ({ ...p, ctaLink: e.target.value }))} />
          </AdminFormField>
        </div>
        <AdminFormField label="Desktop Image">
          <ImageUploader value={form.imageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
        </AdminFormField>
        <AdminFormField label="Mobile Image">
          <ImageUploader value={form.mobileImageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, mobileImageUrl: url }))} />
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Background Color">
            <input type="color" className={adminInputClass} value={form.backgroundColor ?? '#1a0c10'} onChange={(e) => setForm((p) => ({ ...p, backgroundColor: e.target.value }))} />
          </AdminFormField>
          <AdminFormField label="Text Color">
            <input type="color" className={adminInputClass} value={form.textColor ?? '#fdf4e8'} onChange={(e) => setForm((p) => ({ ...p, textColor: e.target.value }))} />
          </AdminFormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Sort Order">
            <input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
          </AdminFormField>
          <AdminFormField label="Badge Text">
            <input className={adminInputClass} value={form.badgeText ?? ''} onChange={(e) => setForm((p) => ({ ...p, badgeText: e.target.value }))} />
          </AdminFormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Start Date">
            <input type="date" className={adminInputClass} value={form.startDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
          </AdminFormField>
          <AdminFormField label="End Date">
            <input type="date" className={adminInputClass} value={form.endDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
          </AdminFormField>
        </div>
        <AdminFormField label="Active">
          <Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} />
        </AdminFormField>
      </AdminModal>
    </div>
  )
}
