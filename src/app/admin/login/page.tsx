'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminInputClass } from '@/components/admin/AdminFormField'
import { ADMIN_TOKEN_KEY } from '@/components/admin/admin-api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true')
      localStorage.setItem(ADMIN_TOKEN_KEY, process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || '')
      router.push('/admin')
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a0c10] p-6">
      <div className="w-full max-w-md">
        <h1 className="text-center font-cinzel text-2xl text-[#c9a84c]">MyGift.pk</h1>
        <p className="mb-10 text-center font-lufga text-sm font-light text-[#8a7060]">Admin Access</p>
        <input
          type="password"
          placeholder="Enter admin password"
          className={adminInputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleLogin()
          }}
        />
        {error && <p className="mt-2 text-sm text-[#e05c5c]">{error}</p>}
        <button
          type="button"
          onClick={() => void handleLogin()}
          className="mt-4 h-12 w-full bg-[#c9a84c] font-lufga text-sm font-semibold text-[#0f0608]"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
