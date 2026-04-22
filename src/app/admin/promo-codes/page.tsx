'use client'

import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface PromoCode {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrderAmount?: number
  maxUses?: number
  usedCount: number
  isActive: boolean
  startDate?: string
  expiryDate?: string
  description?: string
}

const initialForm: Partial<PromoCode> = { type: 'percent', value: 10, usedCount: 0, isActive: true }

function daysRemaining(expiryDate?: string) {
  if (!expiryDate) return '-'
  const diff = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'Expired'
  return `${diff} days`
}

export default function AdminPromoCodesPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<PromoCode>('promo-codes')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<PromoCode>>(initialForm)

  const currentValueLabel = useMemo(
    () => (form.type === 'percent' ? `${Number(form.value || 0)}%` : `Rs${Number(form.value || 0).toLocaleString('en-PK')}`),
    [form.type, form.value],
  )

  return (
    <div>
      <AdminPageHeader title="Promo Codes" onAdd={() => { setForm(initialForm); setOpen(true) }} />
      <AdminTable
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'type', label: 'Type' },
          { key: 'value', label: 'Value', render: (_, row) => (row.type === 'percent' ? `${row.value}%` : `Rs${row.value}`) },
          { key: 'usedCount', label: 'Used', render: (_, row) => `${row.usedCount}/${row.maxUses || '∞'}` },
          { key: 'expiryDate', label: 'Expires', render: (_, row) => daysRemaining(row.expiryDate) },
          { key: 'isActive', label: 'Status', render: (v) => (v ? 'Active' : 'Inactive') },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit Promo Code' : 'Add Promo Code'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <AdminFormField label="Code">
          <div className="flex gap-2">
            <input className={adminInputClass} value={form.code ?? ''} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
            <button type="button" className="bg-[#fdf6ee] px-3 text-xs text-[#8a7060]" onClick={() => setForm((p) => ({ ...p, code: `GIFT${Math.floor(1000 + Math.random() * 9000)}` }))}>Generate</button>
          </div>
        </AdminFormField>
        <AdminFormField label="Type">
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" checked={form.type === 'percent'} onChange={() => setForm((p) => ({ ...p, type: 'percent' }))} />Percentage</label>
            <label className="flex items-center gap-2"><input type="radio" checked={form.type === 'fixed'} onChange={() => setForm((p) => ({ ...p, type: 'fixed' }))} />Fixed Amount</label>
          </div>
        </AdminFormField>
        <AdminFormField label={`Value (${form.type === 'percent' ? '%' : 'Rs'})`}>
          <input type="number" className={adminInputClass} value={form.value ?? 0} onChange={(e) => setForm((p) => ({ ...p, value: Number(e.target.value) }))} />
          <p className="mt-1 text-xs text-[#8a7060]">Preview: {currentValueLabel}</p>
        </AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Min Order Amount"><input type="number" className={adminInputClass} value={form.minOrderAmount ?? 0} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: Number(e.target.value) }))} /></AdminFormField>
          <AdminFormField label="Max Uses"><input type="number" className={adminInputClass} value={form.maxUses ?? ''} onChange={(e) => setForm((p) => ({ ...p, maxUses: e.target.value ? Number(e.target.value) : undefined }))} /></AdminFormField>
        </div>
        <AdminFormField label="Description"><input className={adminInputClass} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Start Date"><input type="date" className={adminInputClass} value={form.startDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} /></AdminFormField>
          <AdminFormField label="Expiry Date"><input type="date" className={adminInputClass} value={form.expiryDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} /></AdminFormField>
        </div>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(n) => setForm((p) => ({ ...p, isActive: n }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
