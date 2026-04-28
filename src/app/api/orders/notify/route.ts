import { NextRequest, NextResponse } from 'next/server'
import type { Order } from '@/types/order'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { order: Order }
    const order = body.order

    let message = `🎁 *NEW ORDER — ${order.orderNumber}*\n\n`
    message += `📊 Type: ${order.type === 'giftlab' ? '🎀 GiftLab' : order.type === 'send-to-pakistan' ? '🌏 Send to PK' : '📦 Standard'}\n`
    message += `💰 Amount: Rs ${order.total.toLocaleString('en-PK')}\n`
    message += `💳 Payment: ${order.paymentMethod.toUpperCase()}\n\n`
    
    message += `👤 *CUSTOMER*\n`
    message += `Name: ${order.customer.name}\n`
    message += `Phone: ${order.customer.phone}\n`
    message += `Email: ${order.customer.email || 'N/A'}\n\n`

    if (order.type === 'send-to-pakistan' && order.diasporaData) {
      const d = order.diasporaData
      message += `📍 *RECIPIENT IN PAKISTAN*\n`
      message += `Name: ${d.recipient.name}\n`
      message += `Relation: ${d.recipient.relation}\n`
      message += `City: ${d.recipient.city}\n`
      message += `Phone: ${d.recipient.phone}\n`
      message += `Delivery: ${d.recipient.deliverySlot}\n`
      
      if (d.recipient.deliveryDate) {
        const deliveryDate = new Date(d.recipient.deliveryDate)
        message += `Date: ${deliveryDate.toLocaleDateString('en-PK')}\n`
      }

      if (d.recipient.specialInstructions) {
        message += `📝 Instructions: ${d.recipient.specialInstructions}\n`
      }

      message += `\n🎁 *GIFT*\n`
      message += `Product: ${d.product.name}\n`
      message += `Price: Rs ${d.product.price.toLocaleString('en-PK')}\n`

      if (d.giftNote.message) {
        message += `\n💌 *MESSAGE*\n`
        message += `"${d.giftNote.message}"\n`
        if (d.giftNote.senderName) {
          message += `— ${d.giftNote.senderName}\n`
        }
      }

      message += `\n💱 *BUYER CURRENCY*\n`
      message += `${d.buyerCurrency} ${d.foreignTotal.toFixed(2)}\n`
      message += `Rate: 1 ${d.buyerCurrency} = Rs ${Math.round(d.exchangeRate)}\n`
    } else if (order.type === 'giftlab' && order.giftlabData) {
      const d = order.giftlabData
      message += `🎀 *GIFTLAB ORDER*\n`
      message += `Occasion: ${d.occasion}\n`
      message += `Box: ${d.box.name} (${d.box.dimensions})\n`
      message += `Items: ${d.items.length}\n`
      message += `Ribbon: ${d.ribbon}\n`

      if (d.addOns.length > 0) {
        message += `Add-ons: ${d.addOns.map(a => a.name).join(', ')}\n`
      }

      if (d.message) {
        message += `\n💌 *MESSAGE*\n`
        message += `"${d.message}"\n`
        if (d.senderName) {
          message += `— ${d.senderName}\n`
        }
      }

      if (d.delivery) {
        message += `\n🚚 Delivery: ${d.delivery}\n`
      }
    }

    message += `\n✅ *ORDER LINK*\n`
    message += `https://mygift.pk/admin/orders/${order.id}\n`
    message += `\n_Sent from MyGift.pk Admin Panel_`

    // Generate WhatsApp URL - admin can click to open WhatsApp web
    const adminWANumber = process.env.ADMIN_WHATSAPP_NUMBER || '923001234567' // Default number
    const waUrl = `https://wa.me/${adminWANumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

    return NextResponse.json({
      success: true,
      message,
      waUrl
    })

  } catch (err) {
    console.error('Notification error:', err)
    return NextResponse.json({ error: 'Failed to generate notification' }, { status: 500 })
  }
}
