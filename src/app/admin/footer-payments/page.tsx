'use client'

import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface FooterPayment {
  id: string
  name: string
  isActive: boolean
  sortOrder: number
}

const initialForm: Partial<FooterPayment> = {
  name: '',
  isActive: true,
  sortOrder: 1,
}

export default function AdminFooterPaymentsPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<FooterPayment>('footer-payments')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<FooterPayment>>(initialForm)

  const sorted = useMemo(
    () => [...data].sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999)),
    [data],
  )

  return (
    <div>
      <AdminPageHeader
        title="Footer Payment Methods"
        onAdd={() => {
          setForm(initialForm)
          setOpen(true)
        }}
        addLabel="Add Payment Method"
      />
      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
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
        title={form.id ? 'Edit Payment Method' : 'Add Payment Method'}
        saving={saving}
        onSave={async () => {
          await save(form)
          setOpen(false)
        }}
      >
        <AdminFormField label="Payment Method Name" required>
          <input className={adminInputClass} value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Sort Order">
          <input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value || 1) }))} />
        </AdminFormField>
        <AdminFormField label="Active">
          <Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} />
        </AdminFormField>
      </AdminModal>
    </div>
  )
}
