'use client'

import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface HeaderLink {
  id: string
  label: string
  href: string
  hasDropdown: boolean
  showInDesktop: boolean
  showInMobile: boolean
  isActive: boolean
  sortOrder: number
}

const initialForm: Partial<HeaderLink> = {
  label: '',
  href: '/shop',
  hasDropdown: false,
  showInDesktop: true,
  showInMobile: true,
  isActive: true,
  sortOrder: 1,
}

export default function AdminHeaderLinksPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<HeaderLink>('header-links')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<HeaderLink>>(initialForm)

  const sorted = useMemo(
    () => [...data].sort((a, b) => Number(a.sortOrder || 999) - Number(b.sortOrder || 999)),
    [data],
  )

  return (
    <div>
      <AdminPageHeader
        title="Header Links"
        onAdd={() => {
          setForm(initialForm)
          setOpen(true)
        }}
      />
      <AdminTable
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'href', label: 'URL' },
          { key: 'sortOrder', label: 'Sort' },
          { key: 'showInDesktop', label: 'Desktop', render: (v) => (v ? 'Yes' : 'No') },
          { key: 'showInMobile', label: 'Mobile', render: (v) => (v ? 'Yes' : 'No') },
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
        title={form.id ? 'Edit Header Link' : 'Add Header Link'}
        saving={saving}
        onSave={async () => {
          await save(form)
          setOpen(false)
        }}
      >
        <AdminFormField label="Label" required>
          <input className={adminInputClass} value={form.label ?? ''} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="URL" required>
          <input className={adminInputClass} value={form.href ?? ''} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} />
        </AdminFormField>
        <AdminFormField label="Sort Order">
          <input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value || 1) }))} />
        </AdminFormField>
        <AdminFormField label="Has Dropdown Icon">
          <Toggle checked={Boolean(form.hasDropdown)} onChange={(next) => setForm((p) => ({ ...p, hasDropdown: next }))} />
        </AdminFormField>
        <AdminFormField label="Show in Desktop">
          <Toggle checked={Boolean(form.showInDesktop)} onChange={(next) => setForm((p) => ({ ...p, showInDesktop: next }))} />
        </AdminFormField>
        <AdminFormField label="Show in Mobile">
          <Toggle checked={Boolean(form.showInMobile)} onChange={(next) => setForm((p) => ({ ...p, showInMobile: next }))} />
        </AdminFormField>
        <AdminFormField label="Active">
          <Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} />
        </AdminFormField>
      </AdminModal>
    </div>
  )
}
