import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, generateId } from '@/lib/db'
import type { Order } from '@/types/order'
import { normalizeBaseUrl } from '@/lib/url'

// Generate sequential order number
function generateOrderNumber(): string {
  const orders = readDb<Order>('orders')
  const count = orders.length + 1
  const year = new Date().getFullYear()
  return `MGP-${year}-${String(count).padStart(4, '0')}`
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log('[API] Received order:', JSON.stringify(body, null, 2))

  const safeNum = (v: unknown) => {
    const n = Number(v)
    return Number.isNaN(n) ? 0 : n
  }

  const order: Order = {
    id: generateId(),
    orderNumber: generateOrderNumber(),
    wcOrderId: undefined,
    type: body.type || 'standard',
    customer: {
      name: body.customer?.name || 'Unknown',
      email: body.customer?.email || '',
      phone: body.customer?.phone || '',
      country: body.customer?.country || 'PK',
    },
    deliveryAddress: body.deliveryAddress || undefined,
    subtotal: safeNum(body.subtotal),
    deliveryPrice: safeNum(body.deliveryPrice) || 299,
    discount: safeNum(body.discount),
    promoCode: body.promoCode || null,
    total: safeNum(body.total),
    currency: 'PKR',
    paymentMethod: body.paymentMethod || 'cod',
    paymentStatus: 'pending',
    status: 'pending',
    statusHistory: [{
      status: 'pending',
      timestamp: new Date().toISOString(),
      note: 'Order placed',
      updatedBy: 'system',
    }],
    giftlabData: body.giftlabData || undefined,
    diasporaData: body.diasporaData || undefined,
    items: body.items || undefined,
    customerNote: body.customerNote || '',
    adminNote: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  console.log('[API] Saving order:', order.orderNumber, order.id)
  console.log('[API] GiftLab data:', JSON.stringify(order.giftlabData, null, 2))
  console.log('[API] Diaspora data:', JSON.stringify(order.diasporaData, null, 2))

  try {
    const orders = readDb<Order>('orders')
    orders.unshift(order)
    writeDb('orders', orders)
    console.log('[API] Order saved successfully')
  } catch (dbErr) {
    console.error('[API] DB write failed:', dbErr)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  syncToWooCommerce(order).catch((e) => console.error('[WC Sync]', e))

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
  }, { status: 201 })
}

// Sync our order to WooCommerce
async function syncToWooCommerce(order: Order) {
  const WC_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_WORDPRESS_URL)
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET
  
  if (!WC_URL || !WC_KEY || !WC_SECRET) return
  
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  
  // Build line items based on order type
  let lineItems: Array<{ product_id: number; quantity: number }> = []
  
  if (order.type === 'giftlab' && order.giftlabData) {
    const d = order.giftlabData
    // Use the items from giftlab
    lineItems = d.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }))
  } else if (order.type === 'send-to-pakistan' && order.diasporaData) {
    if (order.diasporaData.product?.id) {
      lineItems = [{
        product_id: order.diasporaData.product.id,
        quantity: 1,
      }]
    }
  } else if (order.items) {
    lineItems = order.items.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
    }))
  }
  
  // Build WC order payload
  const wcPayload = {
    status: order.paymentMethod === 'cod' ? 'on-hold' : 'pending',
    currency: 'PKR',
    payment_method: order.paymentMethod === 'cod' ? 'cod' : 'bacs',
    payment_method_title: getPaymentMethodTitle(order.paymentMethod),
    set_paid: false,
    billing: {
      first_name: order.customer.name.split(' ')[0] || order.customer.name,
      last_name: order.customer.name.split(' ').slice(1).join(' ') || '',
      email: order.customer.email,
      phone: order.customer.phone,
      country: 'PK',
    },
    shipping: order.deliveryAddress ? {
      first_name: order.deliveryAddress.name.split(' ')[0] || '',
      last_name: order.deliveryAddress.name.split(' ').slice(1).join(' ') || '',
      address_1: order.deliveryAddress.address,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.province,
      country: order.deliveryAddress.country || 'PK',
      phone: order.deliveryAddress.phone,
    } : undefined,
    line_items: lineItems,
    shipping_lines: [{
      method_id: 'flat_rate',
      method_title: 'Delivery',
      total: String(order.deliveryPrice),
    }],
    customer_note: buildCustomerNote(order),
    meta_data: buildMetaData(order),
  }
  
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wcPayload),
    })
    
    if (res.ok) {
      const wcOrder = await res.json()
      // Save WC order ID back to our order
      const orders = readDb<Order>('orders')
      const idx = orders.findIndex(o => o.id === order.id)
      if (idx !== -1) {
        orders[idx].wcOrderId = wcOrder.id
        orders[idx].updatedAt = new Date().toISOString()
        writeDb('orders', orders)
      }
    }
  } catch (err) {
    console.error('WooCommerce sync error:', err)
  }
}

function getPaymentMethodTitle(method: string): string {
  const titles: Record<string, string> = {
    'cod': 'Cash on Delivery',
    'card': 'Credit/Debit Card',
    'jazzcash': 'JazzCash',
    'easypaisa': 'EasyPaisa',
    'paypal': 'PayPal',
    'wise': 'Wise Transfer',
  }
  return titles[method] || method
}

function buildCustomerNote(order: Order): string {
  const parts: string[] = []
  parts.push(`Order Type: ${order.type.toUpperCase()}`)
  parts.push(`Order Number: ${order.orderNumber}`)
  
  if (order.type === 'giftlab' && order.giftlabData) {
    const d = order.giftlabData
    parts.push(`\n=== GIFTLAB ORDER ===`)
    parts.push(`Occasion: ${d.occasion}`)
    parts.push(`Box: ${d.box?.name ?? 'N/A'} (${d.box?.dimensions ?? ''})`)
    parts.push(`Ribbon: ${d.ribbon}`)
    parts.push(`Items: ${d.items.map(i => i.name).join(', ')}`)
    if (d.message) parts.push(`Gift Message: "${d.message}"`)
    if (d.senderName) parts.push(`From: ${d.senderName}`)
    if (d.addOns?.length > 0) parts.push(`Add-ons: ${d.addOns.map(a => a.name).join(', ')}`)
    parts.push(`Delivery: ${d.delivery}`)
  }
  
  if (order.type === 'send-to-pakistan' && order.diasporaData) {
    const d = order.diasporaData
    parts.push(`\n=== SEND TO PAKISTAN ORDER ===`)
    parts.push(`Recipient: ${d.recipient.name}`)
    parts.push(`Recipient Phone: ${d.recipient.phone}`)
    parts.push(`Relationship: ${d.recipient.relation}`)
    parts.push(`City: ${d.recipient.city}`)
    parts.push(`Delivery: ${d.recipient.deliverySlot}`)
    if (d.recipient.deliveryDate) parts.push(`Date: ${d.recipient.deliveryDate}`)
    if (d.recipient.specialInstructions) parts.push(`Instructions: ${d.recipient.specialInstructions}`)
    if (d.giftNote.message) parts.push(`Gift Message: "${d.giftNote.message}"`)
    if (d.giftNote.senderName) parts.push(`From: ${d.giftNote.senderName}`)
    parts.push(`Buyer Currency: ${d.buyerCurrency} ${d.foreignTotal.toFixed(2)}`)
  }
  
  return parts.join('\n')
}

function buildMetaData(order: Order): Array<{ key: string; value: string }> {
  const meta: Array<{ key: string; value: string }> = [
    { key: '_mygift_order_id', value: String(order.id) },
    { key: '_mygift_order_number', value: String(order.orderNumber) },
    { key: '_mygift_order_type', value: String(order.type) },
    { key: '_mygift_payment_method', value: String(order.paymentMethod) },
  ]
  
  if (order.type === 'giftlab' && order.giftlabData) {
    meta.push({ key: '_giftlab_data', value: JSON.stringify(order.giftlabData) })
    meta.push({ key: '_giftlab_occasion', value: order.giftlabData.occasion })
    meta.push({ key: '_giftlab_box', value: order.giftlabData.box?.name ?? '' })
    meta.push({ key: '_giftlab_message', value: order.giftlabData.message })
    meta.push({ key: '_giftlab_ribbon', value: order.giftlabData.ribbon })
  }
  
  if (order.type === 'send-to-pakistan' && order.diasporaData) {
    meta.push({ key: '_diaspora_data', value: JSON.stringify(order.diasporaData) })
    meta.push({ key: '_recipient_name', value: order.diasporaData.recipient?.name ?? '' })
    meta.push({ key: '_recipient_phone', value: order.diasporaData.recipient?.phone ?? '' })
    meta.push({ key: '_recipient_city', value: order.diasporaData.recipient?.city ?? '' })
    meta.push({ key: '_gift_message', value: order.diasporaData.giftNote?.message ?? '' })
    meta.push({ key: '_sender_name', value: order.diasporaData.giftNote?.senderName ?? '' })
    meta.push({ key: '_buyer_currency', value: order.diasporaData.buyerCurrency })
    meta.push({ key: '_foreign_total', value: String(order.diasporaData.foreignTotal) })
  }
  
  return meta
}
