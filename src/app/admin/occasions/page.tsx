'use client'

import { icons } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface OccasionAdmin {
  id: string
  slug: string
  name: string
  lucideIcon: string
  glowColor: string
  accentColor: string
  categorySlug: string
  categoryType?: 'woocommerce' | 'manual'
  count?: number
  description: string
  bannerImageUrl?: string
  isActive: boolean
  sortOrder: number
  seoTitle?: string
  seoDescription?: string
}

const initialForm: Partial<OccasionAdmin> = {
  glowColor: '#c9a84c',
  accentColor: '#c4687a',
  isActive: true,
  sortOrder: 1,
  lucideIcon: 'Sparkles',
  categoryType: 'woocommerce',
  count: 0,
}

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function AdminOccasionsPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<OccasionAdmin>('occasions')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<OccasionAdmin>>(initialForm)
  const IconPreview = useMemo(() => icons[(form.lucideIcon || 'Sparkles') as keyof typeof icons] || icons.Sparkles, [form.lucideIcon])

  return (
    <div>
      <AdminPageHeader title="Occasions" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          {
            key: 'lucideIcon',
            label: 'Icon + Color',
            render: (_, row) => (
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full" style={{ background: row.glowColor }} />
                {row.lucideIcon}
              </div>
            ),
          },
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'categorySlug', label: 'WC Category' },
          { key: 'count', label: 'Count', render: (val) => Number(val || 0) },
          { key: 'isActive', label: 'Status', render: (val) => (val ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit Occasion' : 'Add Occasion'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <AdminFormField label="Occasion Name">
          <input className={adminInputClass} value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))} />
        </AdminFormField>
        <AdminFormField label="Slug">
          <input className={adminInputClass} value={form.slug ?? ''} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} />
        </AdminFormField>
        <AdminFormField label="Lucide Icon">
          <input className={adminInputClass} value={form.lucideIcon ?? ''} onChange={(e) => setForm((p) => ({ ...p, lucideIcon: e.target.value }))} />
          <div className="mt-2 text-[#c9a84c]"><IconPreview size={18} /></div>
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Glow Color"><input type="color" className={adminInputClass} value={form.glowColor ?? '#c9a84c'} onChange={(e) => setForm((p) => ({ ...p, glowColor: e.target.value }))} /></AdminFormField>
          <AdminFormField label="Accent Color"><input type="color" className={adminInputClass} value={form.accentColor ?? '#c4687a'} onChange={(e) => setForm((p) => ({ ...p, accentColor: e.target.value }))} /></AdminFormField>
        </div>
        <AdminFormField label="WooCommerce Category Slug">
          <input className={adminInputClass} value={form.categorySlug ?? ''} onChange={(e) => setForm((p) => ({ ...p, categorySlug: e.target.value }))} />
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Category Type">
            <select
              className={adminInputClass}
              value={form.categoryType ?? 'woocommerce'}
              onChange={(e) => setForm((p) => ({ ...p, categoryType: e.target.value as OccasionAdmin['categoryType'] }))}
            >
              <option value="woocommerce">WooCommerce</option>
              <option value="manual">Manual</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Display Count">
            <input
              type="number"
              min={0}
              className={adminInputClass}
              value={form.count ?? 0}
              onChange={(e) => setForm((p) => ({ ...p, count: Number(e.target.value || 0) }))}
            />
          </AdminFormField>
        </div>
        <AdminFormField label="Description"><textarea rows={3} className={adminInputClass} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Sort Order">
          <input
            type="number"
            min={1}
            className={adminInputClass}
            value={form.sortOrder ?? 1}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value || 1) }))}
          />
        </AdminFormField>
        <AdminFormField label="Banner Image"><ImageUploader value={form.bannerImageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, bannerImageUrl: url }))} /></AdminFormField>
        <AdminFormField label="SEO Title"><input className={adminInputClass} value={form.seoTitle ?? ''} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} /></AdminFormField>
        <AdminFormField label="SEO Description"><textarea rows={2} className={adminInputClass} value={form.seoDescription ?? ''} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
