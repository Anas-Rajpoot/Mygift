'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState<string>('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        if (status === 'saving') return
        setStatus('saving')
        setMsg('')
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })
          const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
          if (!res.ok) throw new Error(data.error || 'Request failed')

          setStatus('success')
          setMsg('Message received. We’ll get back to you soon.')
          setForm({ name: '', email: '', phone: '', message: '' })
        } catch (err) {
          setStatus('error')
          setMsg(err instanceof Error ? err.message : 'Something went wrong.')
        }
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--cream)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <input
          type="email"
          className="w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--cream)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
      </div>
      <input
        className="w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--cream)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
      />
      <textarea
        rows={5}
        className="w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--cream)] placeholder-[var(--muted)] focus:border-[var(--gold)] focus:outline-none"
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
        required
      />

      <button
        type="submit"
        disabled={status === 'saving'}
        className="border border-[var(--gold)] bg-[var(--gold)] px-6 py-3 font-accent text-[11px] uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'saving' ? 'Sending…' : 'Send message'}
      </button>

      {msg ? <p className={`text-xs ${status === 'error' ? 'text-[#ffb4b4]' : 'text-[var(--muted)]'}`}>{msg}</p> : null}
    </form>
  )
}

