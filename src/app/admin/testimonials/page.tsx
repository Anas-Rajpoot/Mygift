'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface Testimonial {
  id: string
  customerName: string
  location: string
  rating: 1 | 2 | 3 | 4 | 5
  reviewText: string
  productName?: string
  avatarUrl?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
}

const initialForm: Partial<Testimonial> = { rating: 5, isActive: true, isFeatured: false, sortOrder: 1 }

export default function AdminTestimonialsPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<Testimonial>('testimonials')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Testimonial>>(initialForm)

  return (
    <div>
      <AdminPageHeader title="Testimonials" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          { key: 'customerName', label: 'Name' },
          {
            key: 'rating',
            label: 'Rating',
            render: (_, row) => (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((__, i) => <Star key={i} size={12} className={i < row.rating ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-[#d0c3b5]'} />)}
              </div>
            ),
          },
          { key: 'reviewText', label: 'Text', render: (v) => String(v).slice(0, 60) },
          { key: 'isFeatured', label: 'Featured', render: (v) => (v ? 'Yes' : 'No') },
          { key: 'isActive', label: 'Status', render: (v) => (v ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit Testimonial' : 'Add Testimonial'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Customer Name"><input className={adminInputClass} value={form.customerName ?? ''} onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} /></AdminFormField>
          <AdminFormField label="Location"><input className={adminInputClass} value={form.location ?? ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} /></AdminFormField>
        </div>
        <AdminFormField label="Rating">
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5] as const).map((rate) => (
              <button key={rate} type="button" onClick={() => setForm((p) => ({ ...p, rating: rate }))}>
                <Star size={18} className={rate <= Number(form.rating ?? 5) ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-[#d0c3b5]'} />
              </button>
            ))}
          </div>
        </AdminFormField>
        <AdminFormField label="Review Text"><textarea rows={4} className={adminInputClass} value={form.reviewText ?? ''} onChange={(e) => setForm((p) => ({ ...p, reviewText: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Product Name"><input className={adminInputClass} value={form.productName ?? ''} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Avatar"><ImageUploader value={form.avatarUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, avatarUrl: url }))} /></AdminFormField>
        <AdminFormField label="Featured"><Toggle checked={Boolean(form.isFeatured)} onChange={(n) => setForm((p) => ({ ...p, isFeatured: n }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(n) => setForm((p) => ({ ...p, isActive: n }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
