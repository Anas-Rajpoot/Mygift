import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, generateId } from '@/lib/db'

type NewsletterSubscriber = {
  id: string
  email: string
  createdAt: string
  source?: string
}

function isValidEmail(email: string) {
  const value = email.trim().toLowerCase()
  if (!value) return false
  // Simple, robust email check for capture forms
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string; source?: string }
    const email = String(body.email || '').trim().toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const list = readDb<NewsletterSubscriber>('newsletter-subscribers')
    const exists = list.some((s) => String(s.email).toLowerCase() === email)
    if (exists) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    const next: NewsletterSubscriber = {
      id: generateId(),
      email,
      source: body.source ? String(body.source).slice(0, 120) : 'footer',
      createdAt: new Date().toISOString(),
    }
    writeDb('newsletter-subscribers', [next, ...list].slice(0, 10000))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

