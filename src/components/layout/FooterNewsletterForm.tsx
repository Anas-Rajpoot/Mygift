'use client'

import { useMemo, useState } from 'react'

export function FooterNewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const canSubmit = useMemo(() => {
    const val = email.trim()
    return status !== 'saving' && val.length >= 5 && val.includes('@')
  }, [email, status])

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!canSubmit) return
        setStatus('saving')
        setMessage('')
        try {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, source: 'footer' }),
          })
          const data = (await res.json().catch(() => ({}))) as { ok?: boolean; alreadySubscribed?: boolean; error?: string }
          if (!res.ok) throw new Error(data.error || 'Request failed')

          setStatus('success')
          setMessage(data.alreadySubscribed ? 'You’re already subscribed.' : 'Welcome — check your inbox soon.')
          setEmail('')
        } catch (err) {
          setStatus('error')
          setMessage(err instanceof Error ? err.message : 'Something went wrong.')
        }
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--cream)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-[var(--gold)] px-6 py-3 font-accent text-[11px] uppercase tracking-[0.15em] text-[var(--ink)] transition-colors hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'saving' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {message ? (
        <p className={`text-left text-xs sm:text-right ${status === 'error' ? 'text-[#ffb4b4]' : 'text-[var(--muted)]'}`}>
          {message}
        </p>
      ) : null}
    </form>
  )
}

