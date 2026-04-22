'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { RefreshCw, Upload } from 'lucide-react'
import { adminInputClass } from './AdminFormField'
import { getAdminToken } from './admin-api'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string) => void
  label?: string
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: { 'x-admin-token': getAdminToken() },
      })
      const data = await res.json()
      if (data?.url) onChange(data.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <p className="mb-2 text-xs text-[#8a7060]">{label}</p>}
      <button
        type="button"
        className="relative flex h-[200px] w-full flex-col items-center justify-center border border-dashed border-[#d4c4b0] bg-[#fdf8f4] hover:border-[#c9a84c] hover:bg-[#fdf6ee]"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="Preview" width={280} height={160} className="max-h-[160px] w-auto object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition hover:bg-black/30 hover:text-white">
              <span className="flex items-center gap-2 text-sm">
                <RefreshCw size={14} />
                Change image
              </span>
            </div>
          </>
        ) : (
          <>
            <Upload size={24} className="text-[#c9a84c]" />
            <p className="mt-2 text-sm text-[#8a7060]">{uploading ? 'Uploading...' : 'Click or drag to upload'}</p>
            <p className="text-xs text-[#a09080]">JPG, PNG, WebP up to 5MB</p>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      <p className="mt-3 text-xs text-[#8a7060]">Or enter URL:</p>
      <input className={adminInputClass} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
