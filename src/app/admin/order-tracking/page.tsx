'use client'

import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

type OrderTracking = {
  id: string // order id
  carrier: string
  trackingNumber: string
  trackingUrl: string
  statusNote: string
  isActive: boolean
  updatedAt?: string
}

const initialForm: Partial<OrderTracking> = {
  id: '',
  carrier: '',
  trackingNumber: '',
  trackingUrl: '',
  statusNote: '',
  isActive: true,
}

export default function AdminOrderTrackingPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<OrderTracking>('order-tracking')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<OrderTracking>>(initialForm)

  const sorted = useMemo(() => [...data].sort((a, b) => Number(b.id) - Number(a.id)), [data])

  return (
    <div>
      <AdminPageHeader
        title="Order Tracking"
        addLabel="Add Tracking"
        onAdd={() => {
          setForm(initialForm)
          setOpen(true)
        }}
      />

      <AdminTable
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'carrier', label: 'Carrier' },
          { key: 'trackingNumber', label: 'Tracking #' },
          { key: 'isActive', label: 'Active', render: (v) => (v ? 'Yes' : 'No') },
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
        title={form.id ? 'Edit Tracking' : 'Add Tracking'}
        saving={saving}
        onSave={async () => {
          await save({ ...form, updatedAt: new Date().toISOString() })
          setOpen(false)
        }}
      >
        <AdminFormField label="Order ID" required hint="WooCommerce order ID (number)">
          <input className={adminInputClass} value={form.id ?? ''} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value.replace(/[^0-9]/g, '') }))} />
        </AdminFormField>
        <AdminFormField label="Carrier">
          <input className={adminInputClass} value={form.carrier ?? ''} onChange={(e) => setForm((p) => ({ ...p, carrier: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Tracking Number">
          <input className={adminInputClass} value={form.trackingNumber ?? ''} onChange={(e) => setForm((p) => ({ ...p, trackingNumber: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Tracking URL">
          <input className={adminInputClass} placeholder="https://..." value={form.trackingUrl ?? ''} onChange={(e) => setForm((p) => ({ ...p, trackingUrl: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Status Note">
          <textarea rows={3} className={adminInputClass} value={form.statusNote ?? ''} onChange={(e) => setForm((p) => ({ ...p, statusNote: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Active">
          <Toggle checked={Boolean(form.isActive)} onChange={(n) => setForm((p) => ({ ...p, isActive: n }))} />
        </AdminFormField>
      </AdminModal>
    </div>
  )
}

