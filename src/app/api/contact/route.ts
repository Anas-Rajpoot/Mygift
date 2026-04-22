import { NextRequest, NextResponse } from 'next/server'
import { generateId, readDb, writeDb } from '@/lib/db'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: string
}

function isValidEmail(email: string) {
  const value = email.trim().toLowerCase()
  if (!value) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<ContactMessage>
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const message = String(body.message || '').trim()

    if (!name || name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    if (!message || message.length < 10) return NextResponse.json({ error: 'Please enter a message (min 10 characters).' }, { status: 400 })

    const list = readDb<ContactMessage>('contact-messages')
    const next: ContactMessage = { id: generateId(), name, email, phone, message, createdAt: new Date().toISOString() }
    writeDb('contact-messages', [next, ...list].slice(0, 20000))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

