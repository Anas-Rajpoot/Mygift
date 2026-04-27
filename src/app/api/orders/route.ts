import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb, generateId } from '@/lib/db'
import type { Order } from '@/types/order'

// Generate sequential order number
function generateOrderNumber(): string {
  const orders = readDb<Order>('orders')
  const count = orders.length + 1
  const year = new Date().getFullYear()
  return `MGP-${year}-${String(count).padStart(4, '0')}`
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const date = searchParams.get('date')
    let orders = readDb<Order>('orders')

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status)
    }
    if (type && type !== 'all') {
      orders = orders.filter(o => o.type === type)
    }
    if (search) {
      const q = search.toLowerCase()
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.diasporaData?.recipient?.name.toLowerCase().includes(q) ||
        o.diasporaData?.recipient?.city.toLowerCase().includes(q)
      )
    }
    if (date === 'today') {
      const today = new Date().toDateString()
      orders = orders.filter(o => new Date(o.createdAt).toDateString() === today)
    } else if (date === 'week') {
      const now = Date.now()
      orders = orders.filter(o => now - new Date(o.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000)
    } else if (date === 'month') {
      const now = Date.now()
      orders = orders.filter(o => now - new Date(o.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000)
    }

    return NextResponse.json({
      orders,
      total: orders.length,
      pendingCount: orders.filter(o => o.status === 'pending').length,
      codPending: orders.filter(o => o.paymentMethod === 'cod' && o.paymentStatus !== 'paid').length,
      todayRevenue: orders
        .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, o) => sum + o.total, 0),
    })
  } catch (err) {
    console.error('Orders fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Extract shipping cost from shipping_lines
    const shippingCost = body.shipping_lines?.[0]?.total ? parseFloat(body.shipping_lines[0].total) : 0
    
    // Calculate subtotal (sum of line items total)
    const subtotal = body.line_items?.reduce((sum: number, item: any) => sum + parseFloat(item.total || 0), 0) || 0
    
    // Calculate total fees
    const feeTotal = body.fee_lines?.reduce((sum: number, fee: any) => sum + parseFloat(fee.total || 0), 0) || 0
    
    // Calculate discount (if applicable)
    const discount = parseFloat(body.discount || 0)
    
    // Total = subtotal + shipping + fees - discount
    const total = subtotal + shippingCost + feeTotal - discount
    
    // Map payment method names
    const paymentMethodMap: { [key: string]: string } = {
      'cod': 'cod',
      'bacs': 'card',
      'card': 'card',
      'jazzcash': 'jazzcash',
      'easypaisa': 'easypaisa',
      'paypal': 'paypal',
      'wise': 'wise',
    }
    
    const paymentMethod = paymentMethodMap[body.payment_method] || body.payment_method
    
    // Build items array from line items
    const items = body.line_items?.map((item: any) => ({
      id: item.product_id?.toString() || `item-${Math.random()}`,
      name: item.name || 'Product',
      price: parseFloat(item.total || 0),
      imageUrl: item.image?.src || '',
      quantity: item.quantity || 1,
    })) || []
    
    // Build the order object
    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      wcOrderId: undefined,
      type: 'standard',
      customer: {
        name: body.billing?.first_name ? `${body.billing.first_name} ${body.billing.last_name || ''}`.trim() : 'Guest',
        email: body.billing?.email || '',
        phone: body.billing?.phone || '',
        country: body.billing?.country || 'PK',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      },
      subtotal,
      deliveryPrice: shippingCost,
      discount,
      promoCode: null,
      total,
      currency: 'PKR',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      transactionId: undefined,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed',
          updatedBy: 'customer',
        },
      ],
      customerNote: '',
      adminNote: '',
      items,
      deliveryAddress: {
        name: body.shipping?.first_name ? `${body.shipping.first_name} ${body.shipping.last_name || ''}`.trim() : body.billing?.first_name ? `${body.billing.first_name} ${body.billing.last_name || ''}`.trim() : '',
        phone: body.shipping?.phone || body.billing?.phone || '',
        address: body.shipping?.address_1 || body.billing?.address_1 || '',
        city: body.shipping?.city || body.billing?.city || '',
        province: body.shipping?.state || body.billing?.state || '',
        country: body.shipping?.country || body.billing?.country || 'PK',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Save to database
    const orders = readDb<Order>('orders')
    orders.unshift(order)
    writeDb<Order>('orders', orders)
    
    // Return response
    return NextResponse.json({
      success: true,
      id: order.id,
      orderNumber: order.orderNumber,
      orderId: order.id,
      message: 'Order created successfully',
    })
    
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ 
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create order',
    }, { status: 500 })
  }
}
