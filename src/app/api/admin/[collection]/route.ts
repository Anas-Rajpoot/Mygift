import { NextRequest, NextResponse } from 'next/server'
import { generateId, readDb, writeDb } from '@/lib/db'

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!ALLOWED.includes(collection)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const data = readDb(collection)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!ALLOWED.includes(collection)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json()
  const data = readDb<Record<string, unknown>>(collection)
  const newItem = { ...body, id: generateId(), createdAt: new Date().toISOString() }
  data.push(newItem)
  writeDb(collection, data)
  return NextResponse.json(newItem, { status: 201 })
}
