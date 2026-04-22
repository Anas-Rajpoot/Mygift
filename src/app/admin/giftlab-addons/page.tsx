'use client'

import { icons } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface GiftLabAddon {
  id: string
  name: string
  price: number
  lucideIcon: string
  description: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  category: 'decoration' | 'card' | 'food' | 'other'
}

const initialForm: Partial<GiftLabAddon> = { price: 0, isActive: true, sortOrder: 1, category: 'other', lucideIcon: 'Gift' }

export default function AdminGiftlabAddonsPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<GiftLabAddon>('giftlab-addons')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<GiftLabAddon>>(initialForm)

  const IconPreview = useMemo(() => icons[(form.lucideIcon || 'Gift') as keyof typeof icons] || icons.Gift, [form.lucideIcon])

  return (
    <div>
      <AdminPageHeader title="GiftLab Add-ons" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          { key: 'lucideIcon', label: 'Icon' },
          { key: 'name', label: 'Name' },
          { key: 'price', label: 'Price' },
          { key: 'category', label: 'Category' },
          { key: 'isActive', label: 'Status', render: (val) => (val ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit Add-on' : 'Add Add-on'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <AdminFormField label="Name"><input className={adminInputClass} value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Price (PKR)"><input type="number" className={adminInputClass} value={form.price ?? 0} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField label="Sort Order"><input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} /></AdminFormField>
        </div>
        <AdminFormField label="Lucide Icon Name" hint="Find icon names at lucide.dev">
          <input className={adminInputClass} value={form.lucideIcon ?? ''} onChange={(e) => setForm((p) => ({ ...p, lucideIcon: e.target.value }))} />
          <div className="mt-2 text-[#c9a84c]"><IconPreview size={18} /></div>
        </AdminFormField>
        <AdminFormField label="Description"><textarea rows={2} className={adminInputClass} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Category">
          <select className={adminInputClass} value={form.category ?? 'other'} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as GiftLabAddon['category'] }))}>
            <option value="decoration">decoration</option><option value="card">card</option><option value="food">food</option><option value="other">other</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Image"><ImageUploader value={form.imageUrl ?? ''} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
