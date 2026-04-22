'use client'

import { Inbox, Pencil, Trash2 } from 'lucide-react'

interface AdminColumn<T> {
  key: string
  label: string
  render?: (val: unknown, row: T) => React.ReactNode
}

interface AdminTableProps<T extends { id: string }> {
  columns: AdminColumn<T>[]
  data: T[]
  onEdit: (item: T) => void
  onDelete: (id: string) => void
  loading: boolean
}

export function AdminTable<T extends { id: string }>({ columns, data, onEdit, onDelete, loading }: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="border border-[#e8e0d4] bg-white p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-2 h-12 animate-pulse bg-[#f5ede3]" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="border border-[#e8e0d4] bg-white p-12 text-center">
        <Inbox size={32} className="mx-auto text-[#c9a84c]/40" />
        <p className="mt-3 font-lufga text-base font-light text-[#8a7060]">No items yet</p>
        <p className="font-lufga text-sm font-light text-[#a09080]">Click &apos;Add New&apos; to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-[#e8e0d4] bg-white">
      <table className="w-full">
        <thead className="bg-[#fdf6ee]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-[#e8e0d4] px-4 py-3 text-left font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#8a7060]"
              >
                {column.label}
              </th>
            ))}
            <th className="border-b border-[#e8e0d4] px-4 py-3 text-right font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#8a7060]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-[#f0e8de] hover:bg-[#fdf6ee]">
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`} className="px-4 py-3.5 font-lufga text-sm text-[#2a1a14]">
                  {column.render ? column.render((row as Record<string, unknown>)[column.key], row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => onEdit(row)} className="p-1.5 text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)]">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onDelete(row.id)} className="p-1.5 text-[#e05c5c] hover:bg-[rgba(224,92,92,0.1)]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
