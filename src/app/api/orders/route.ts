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
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')?.toLowerCase()
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let orders = readDb<Order>('orders')
    
    // Filter by status
    if (status) {
      orders = orders.filter(o => o.status === status)
    }
    
    // Filter by type
    if (type) {
      orders = orders.filter(o => o.type === type)
    }
    
    // Search by order number, customer name, or phone
    if (search) {
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.customer.name.toLowerCase().includes(search) ||
        o.customer.phone.includes(search)
      )
    }
    
    // Pagination
    const total = orders.length
    const paginated = orders.slice(offset, offset + limit)
    
    return NextResponse.json({
      orders: paginated,
      total,
      limit,
      offset
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
        ip: req.ip || 'unknown',
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
      type: 'standard',
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
