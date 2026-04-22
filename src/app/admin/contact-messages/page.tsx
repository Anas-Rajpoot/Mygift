'use client'

import { useMemo } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { AdminTable } from '@/components/admin/AdminTable'
import { useAdminCollection } from '@/components/admin/useAdminCollection'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: string
}

export default function AdminContactMessagesPage() {
  const { data, loading, remove } = useAdminCollection<ContactMessage>('contact-messages')

  const sorted = useMemo(
    () => [...data].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    [data],
  )

  return (
    <div>
      <AdminPageHeader title="Contact Messages" />
      <AdminTable
        columns={[
          { key: 'createdAt', label: 'Date' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'message', label: 'Message' },
        ]}
        data={sorted}
        loading={loading}
        onEdit={() => undefined as never}
        onDelete={(id) => void remove(id)}
      />
      <p className="mt-4 font-lufga text-xs text-[#8a7060]">Tip: copy the email and reply from your mailbox.</p>
    </div>
  )
}

