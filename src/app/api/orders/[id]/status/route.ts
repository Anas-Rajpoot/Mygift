import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import type { Order, OrderStatus } from '@/types/order'
import { normalizeBaseUrl } from '@/lib/url'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, note } = await req.json()
    
    const orders = readDb<Order>('orders')
    const idx = orders.findIndex(o => o.id === id)
    
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    const now = new Date().toISOString()
    orders[idx].status = status
    orders[idx].updatedAt = now
    
    // Add to status history
    orders[idx].statusHistory.push({
      status,
      timestamp: now,
      note,
      updatedBy: 'admin'
    })
    
    // Set timestamp fields based on status
    if (status === 'packed') orders[idx].packedAt = now
    if (status === 'dispatched') orders[idx].dispatchedAt = now
    if (status === 'delivered') orders[idx].deliveredAt = now
    if (status === 'payment_received') orders[idx].paymentStatus = 'paid'
    
    writeDb('orders', orders)
    
    // Sync status to WooCommerce asynchronously
    syncStatusToWC(orders[idx]).catch(err => 
      console.error('WC status sync failed:', err)
    )
    
    return NextResponse.json(orders[idx])
    
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}

async function syncStatusToWC(order: Order) {
  if (!order.wcOrderId) return
  
  const wcStatusMap: Record<OrderStatus, string> = {
    'pending': 'pending',
    'confirmed': 'processing',
    'packed': 'processing',
    'dispatched': 'on-hold',
    'delivered': 'completed',
    'cancelled': 'cancelled',
    'payment_received': 'completed',
  }
  
  const wcStatus = wcStatusMap[order.status]
  const WC_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_WORDPRESS_URL)
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET
  
  if (!WC_URL || !WC_KEY || !WC_SECRET) return
  
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  
  const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${order.wcOrderId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: wcStatus })
  })
  
  if (!res.ok) {
    console.error('WC status sync failed:', res.statusText)
  }
}
