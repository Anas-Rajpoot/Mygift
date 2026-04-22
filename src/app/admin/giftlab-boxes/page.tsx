'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface GiftLabBox {
  id: string
  name: string
  size: 'small' | 'medium' | 'large' | 'xl'
  basePrice: number
  maxItems: number
  dimensions: string
  weight: string
  imageUrl: string
  description: string
  isActive: boolean
  sortOrder: number
  features: string[]
}

const initialForm: Partial<GiftLabBox> = { size: 'small', basePrice: 0, maxItems: 1, sortOrder: 1, isActive: true, features: [] }

export default function AdminGiftlabBoxesPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<GiftLabBox>('giftlab-boxes')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<GiftLabBox>>(initialForm)

  return (
    <div>
      <AdminPageHeader title="GiftLab Boxes" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          {
            key: 'imageUrl',
            label: 'Image',
            render: (val) =>
              val ? (
                <Image src={String(val)} alt="" width={40} height={40} className="h-10 w-10 object-cover" />
              ) : (
                <div className="h-10 w-10 bg-[#f2e9dd]" />
              ),
          },
          { key: 'name', label: 'Name' },
          { key: 'size', label: 'Size' },
          { key: 'basePrice', label: 'Price' },
          { key: 'maxItems', label: 'Max Items' },
          { key: 'dimensions', label: 'Dimensions' },
          { key: 'isActive', label: 'Status', render: (val) => (val ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={form.id ? 'Edit Box' : 'Add Box'}
        saving={saving}
        onSave={async () => { await save(form); setOpen(false) }}
      >
        <AdminFormField label="Box Name" required>
          <input className={adminInputClass} value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Size">
            <select className={adminInputClass} value={form.size ?? 'small'} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value as GiftLabBox['size'] }))}>
              <option value="small">small</option><option value="medium">medium</option><option value="large">large</option><option value="xl">xl</option>
            </select>
          </AdminFormField>
          <AdminFormField label="Base Price (PKR)">
            <input type="number" className={adminInputClass} value={form.basePrice ?? 0} onChange={(e) => setForm((p) => ({ ...p, basePrice: Number(e.target.value) }))} />
          </AdminFormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Max Items">
            <input type="number" className={adminInputClass} value={form.maxItems ?? 1} onChange={(e) => setForm((p) => ({ ...p, maxItems: Number(e.target.value) }))} />
          </AdminFormField>
          <AdminFormField label="Sort Order">
            <input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
          </AdminFormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Dimensions">
            <input className={adminInputClass} value={form.dimensions ?? ''} onChange={(e) => setForm((p) => ({ ...p, dimensions: e.target.value }))} />
          </AdminFormField>
          <AdminFormField label="Weight">
            <input className={adminInputClass} value={form.weight ?? ''} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} />
          </AdminFormField>
        </div>
        <AdminFormField label="Box Image"><ImageUploader value={form.imageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} /></AdminFormField>
        <AdminFormField label="Description">
          <textarea rows={3} className={adminInputClass} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Features">
          <div className="space-y-2">
            {(form.features ?? []).map((feature, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={adminInputClass}
                  value={feature}
                  onChange={(e) => setForm((p) => ({ ...p, features: (p.features ?? []).map((x, idx) => (idx === i ? e.target.value : x)) }))}
                />
                <button
                  type="button"
                  className="px-2 text-[#e05c5c]"
                  onClick={() => setForm((p) => ({ ...p, features: (p.features ?? []).filter((_, idx) => idx !== i) }))}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="text-sm text-[#c9a84c]" onClick={() => setForm((p) => ({ ...p, features: [...(p.features ?? []), ''] }))}>
              Add feature
            </button>
          </div>
        </AdminFormField>
        <AdminFormField label="Active">
          <Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} />
        </AdminFormField>
      </AdminModal>
    </div>
  )
}
