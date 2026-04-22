'use client'

import { useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface DeliveryCity {
  id: string
  name: string
  slug: string
  province: string
  sameDay: boolean
  nextDay: boolean
  standardDelivery: boolean
  sameDayPrice: number
  nextDayPrice: number
  standardPrice: number
  mapX: number
  mapY: number
  isActive: boolean
  sortOrder: number
  deliveryNotes?: string
}

const initialForm: Partial<DeliveryCity> = { sameDay: true, nextDay: true, standardDelivery: true, sameDayPrice: 299, nextDayPrice: 199, standardPrice: 0, mapX: 50, mapY: 50, isActive: true, sortOrder: 1, province: 'Punjab' }
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function AdminCitiesPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<DeliveryCity>('cities')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<DeliveryCity>>(initialForm)

  return (
    <div>
      <AdminPageHeader title="Delivery Cities" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'province', label: 'Province' },
          { key: 'sameDay', label: 'Same-day', render: (v) => (v ? 'Yes' : 'No') },
          { key: 'nextDay', label: 'Next-day', render: (v) => (v ? 'Yes' : 'No') },
          { key: 'sameDayPrice', label: 'Prices', render: (_, row) => `Same: ${row.sameDayPrice} | Next: ${row.nextDayPrice}` },
          { key: 'isActive', label: 'Status', render: (v) => (v ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit City' : 'Add City'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <AdminFormField label="City Name"><input className={adminInputClass} value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))} /></AdminFormField>
        <AdminFormField label="Province">
          <select className={adminInputClass} value={form.province ?? 'Punjab'} onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}>
            {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'ICT'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </AdminFormField>
        <div className="grid grid-cols-3 gap-3">
          <AdminFormField label="Same-day"><Toggle checked={Boolean(form.sameDay)} onChange={(n) => setForm((p) => ({ ...p, sameDay: n }))} /></AdminFormField>
          <AdminFormField label="Next-day"><Toggle checked={Boolean(form.nextDay)} onChange={(n) => setForm((p) => ({ ...p, nextDay: n }))} /></AdminFormField>
          <AdminFormField label="Standard"><Toggle checked={Boolean(form.standardDelivery)} onChange={(n) => setForm((p) => ({ ...p, standardDelivery: n }))} /></AdminFormField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <AdminFormField label="Same-day Price"><input type="number" className={adminInputClass} value={form.sameDayPrice ?? 0} onChange={(e) => setForm((p) => ({ ...p, sameDayPrice: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField label="Next-day Price"><input type="number" className={adminInputClass} value={form.nextDayPrice ?? 0} onChange={(e) => setForm((p) => ({ ...p, nextDayPrice: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField label="Standard Price"><input type="number" className={adminInputClass} value={form.standardPrice ?? 0} onChange={(e) => setForm((p) => ({ ...p, standardPrice: Number(e.target.value) }))} /></AdminFormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Map Position X (%)"><input type="number" min={0} max={100} className={adminInputClass} value={form.mapX ?? 0} onChange={(e) => setForm((p) => ({ ...p, mapX: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField label="Map Position Y (%)"><input type="number" min={0} max={100} className={adminInputClass} value={form.mapY ?? 0} onChange={(e) => setForm((p) => ({ ...p, mapY: Number(e.target.value) }))} /></AdminFormField>
        </div>
        <div className="mb-4 h-24 border border-[#e8e0d4] bg-[#fdf6ee] p-2">
          <div className="relative h-full w-full rounded bg-[#f4eadf]">
            <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4687a]" style={{ left: `${form.mapX ?? 50}%`, top: `${form.mapY ?? 50}%` }} />
          </div>
        </div>
        <AdminFormField label="Delivery Notes"><textarea rows={2} className={adminInputClass} value={form.deliveryNotes ?? ''} onChange={(e) => setForm((p) => ({ ...p, deliveryNotes: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(n) => setForm((p) => ({ ...p, isActive: n }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
