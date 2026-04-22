'use client'

import { useMemo, useState } from 'react'
import { AdminFormField, adminInputClass } from '@/components/admin/AdminFormField'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminTable } from '@/components/admin/AdminTable'
import { AdminPageHeader, Toggle } from '@/components/admin/AdminUi'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

interface Announcement {
  id: string
  text: string
  link?: string
  isActive: boolean
  sortOrder: number
  startDate?: string
  endDate?: string
}

const initialForm: Partial<Announcement> = { isActive: true, sortOrder: 1 }

export default function AdminAnnouncementsPage() {
  const { data, loading, saving, save, remove } = useAdminCollection<Announcement>('announcements')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Announcement>>(initialForm)

  const activeText = useMemo(
    () =>
      data
        .filter((item) => item.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.text),
    [data],
  )

  return (
    <div>
      <AdminPageHeader title="Announcements" onAdd={() => { setForm(initialForm); setOpen(true) }} />

      <div className="mb-6 overflow-hidden border border-[#3f2730] bg-[#4a1525] py-3">
        <div className="animate-marquee whitespace-nowrap px-4 font-cinzel text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
          {activeText.length ? activeText.join('   ◆   ') : 'No active announcements'}
        </div>
      </div>

      <AdminTable
        columns={[
          { key: 'text', label: 'Text', render: (v) => String(v).slice(0, 70) },
          { key: 'link', label: 'Link' },
          { key: 'isActive', label: 'Status', render: (v) => (v ? 'Active' : 'Inactive') },
          { key: 'startDate', label: 'Date Range', render: (_, row) => `${row.startDate || '-'} to ${row.endDate || '-'}` },
          { key: 'sortOrder', label: 'Order' },
        ]}
        data={data}
        loading={loading}
        onEdit={(item) => { setForm(item); setOpen(true) }}
        onDelete={(id) => void remove(id)}
      />

      <AdminModal open={open} onClose={() => setOpen(false)} title={form.id ? 'Edit Announcement' : 'Add Announcement'} saving={saving} onSave={async () => { await save(form); setOpen(false) }}>
        <AdminFormField label="Text"><textarea rows={3} className={adminInputClass} value={form.text ?? ''} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} /></AdminFormField>
        <AdminFormField label="Link"><input className={adminInputClass} value={form.link ?? ''} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} /></AdminFormField>
        <div className="grid grid-cols-2 gap-3">
          <AdminFormField label="Start Date"><input type="date" className={adminInputClass} value={form.startDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} /></AdminFormField>
          <AdminFormField label="End Date"><input type="date" className={adminInputClass} value={form.endDate ?? ''} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} /></AdminFormField>
        </div>
        <AdminFormField label="Sort Order"><input type="number" className={adminInputClass} value={form.sortOrder ?? 1} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} /></AdminFormField>
        <AdminFormField label="Active"><Toggle checked={Boolean(form.isActive)} onChange={(next) => setForm((p) => ({ ...p, isActive: next }))} /></AdminFormField>
      </AdminModal>
    </div>
  )
}
