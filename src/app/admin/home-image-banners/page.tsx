'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface HomeImageBanner {
  id: string
  title: string
  subtitle?: string
  badge?: string
  imageUrl: string
  mobileImageUrl?: string
  ctaLabel?: string
  ctaHref?: string
  style?: 'full' | 'split' | 'card'
  textAlign?: 'left' | 'center'
  overlayOpacity?: number
  isActive: boolean
  sortOrder: number
}

const initialForm: Partial<HomeImageBanner> = {
  title: '',
  imageUrl: '',
  ctaLabel: 'Shop now',
  ctaHref: '/shop',
  style: 'split',
  textAlign: 'left',
  overlayOpacity: 55,
  isActive: true,
  sortOrder: 1,
}

export default function AdminHomeImageBannersPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<HomeImageBanner>('home-image-banners')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<HomeImageBanner>>(initialForm)

  const sorted = useMemo(
    () => [...data].sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999)),
    [data],
  )

  return (
    <div>
      <AdminPageHeader
        title="Home Image Banners"
        addLabel="Add Image Banner"
        onAdd={() => {
          setForm(initialForm)
          setOpen(true)
        }}
      />

      <AdminTable
        columns={[
          {
            key: 'imageUrl',
            label: 'Preview',
            render: (val) =>
              val ? <Image src={String(val)} alt="banner" width={72} height={44} className="h-11 w-[72px] object-cover" /> : <div className="h-11 w-[72px] bg-[#f2e9dd]" />,
          },
          { key: 'title', label: 'Title' },
          { key: 'style', label: 'Style' },
          { key: 'overlayOpacity', label: 'Overlay %' },
          { key: 'sortOrder', label: 'Sort' },
          { key: 'isActive', label: 'Status', render: (v) => (v ? 'Active' : 'Inactive') },
        ]}
        data={sorted}
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
        title={form.id ? 'Edit Home Image Banner' : 'Add Home Image Banner'}
        saving={saving}
        onSave={async () => {
          await save(form)
          setOpen(false)
        }}
      >
        <AdminFormField label="Title" required>
          <input className={adminInputClass} value={form.title ?? ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Subtitle">
          <textarea rows={2} className={adminInputClass} value={form.subtitle ?? ''} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Badge Text">
          <input className={adminInputClass} value={form.badge ?? ''} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} />
        </AdminFormField>

        <AdminFormField label="Desktop Image" required>
          <ImageUploader value={form.imageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
        </AdminFormField>
        <AdminFormField label="Mobile Image (optional)">
          <ImageUploader value={form.mobileImageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, mobileImageUrl: url }))} />
        </AdminFormField>

        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="CTA Label">
            <input className={adminInputClass} value={form.ctaLabel ?? ''} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} />
          </AdminFormField>
          <AdminFormField label="CTA Link">
            <input className={adminInputClass} value={form.ctaHref ?? ''} onChange={(e) => setForm((p) => ({ ...p, ctaHref: e.target.value }))} />
          </AdminFormField>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <AdminFormField label="Style">
            <select className={adminInputClass} value={form.style ?? 'split'} onChange={(e) => setForm((p) => ({ ...p, style: e.target.value as HomeImageBanner['style'] }))}>
              <option value="full">Full width</option>
              <option value="split">Split</option>
              <option value="card">Card</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Text Align">
            <select className={adminInputClass} value={form.textAlign ?? 'left'} onChange={(e) => setForm((p) => ({ ...p, textAlign: e.target.value as HomeImageBanner['textAlign'] }))}>
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Overlay Opacity %">
            <input type="number" min={10} max={85} className={adminInputClass} value={form.overlayOpacity ?? 55} onChange={(e) => setForm((p) => ({ ...p, overlayOpacity: Number(e.target.value || 55) }))} />
          </AdminFormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Sort Order">
            <input type="number" min={1} className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value || 1) }))} />
          </AdminFormField>
          <AdminFormField label="Active">
            <Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} />
          </AdminFormField>
        </div>
      </AdminModal>
    </div>
  )
}
