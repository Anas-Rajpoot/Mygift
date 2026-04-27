import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import type { Order } from '@/types/order'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orders = readDb<Order>('orders')
    const order = orders.find(o => o.id === id)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (err) {
    console.error('Order fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const orders = readDb<Order>('orders')
    const idx = orders.findIndex(o => o.id === id)
    
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Update admin note or other fields
    if (body.adminNote !== undefined) {
      orders[idx].adminNote = body.adminNote
      orders[idx].updatedAt = new Date().toISOString()
    }
    
    writeDb('orders', orders)
    
    return NextResponse.json(orders[idx])
  } catch (err) {
    console.error('Order update error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
