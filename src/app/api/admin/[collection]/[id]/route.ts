import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

const ALLOWED = [
  'giftlab-boxes',
  'giftlab-addons',
  'banners',
  'send-to-pakistan',
  'occasions',
  'cities',
  'announcements',
  'testimonials',
  'promo-codes',
  'site-settings',
  'header-links',
  'footer-links',
  'footer-payments',
  'home-image-banners',
  'order-tracking',
  'contact-messages',
]

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_SECRET_TOKEN
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!ALLOWED.includes(collection)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json()
  const data = readDb<Record<string, unknown>>(collection)
  const index = data.findIndex((item) => item.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[index] = { ...data[index], ...body, updatedAt: new Date().toISOString() }
  writeDb(collection, data)
  return NextResponse.json(data[index])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!ALLOWED.includes(collection)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = readDb<Record<string, unknown>>(collection)
  const filtered = data.filter((item) => item.id !== id)
  writeDb(collection, filtered)
  return NextResponse.json({ success: true })
}
