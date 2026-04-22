'use client'

import { AlertCircle } from 'lucide-react'

interface AdminFormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

export function AdminFormField({ label, required, error, hint, children }: AdminFormFieldProps) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block font-lufga text-xs font-medium text-[#6b5c4e]">
        {label}
        {required && <span className="ml-1 text-[#e05c5c]">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] italic text-[#a09080]">{hint}</p>}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#e05c5c]">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
    </div>
  )
}

export const adminInputClass =
  'w-full rounded-[4px] border border-[#e0d4c8] bg-white px-3 py-2.5 font-lufga text-sm text-[#1a0c10] outline-none transition focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]'
