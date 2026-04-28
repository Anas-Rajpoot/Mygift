'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import type { Order } from '@/types/order'

const statusConfig = {
  pending: { label: 'Pending', bg: '#fef9ed', color: '#92670a', border: '#f0d070' },
  confirmed: { label: 'Confirmed', bg: '#eff6ff', color: '#1e4db7', border: '#bfdbfe' },
  packed: { label: 'Packed', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  dispatched: { label: 'Dispatched', bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  delivered: { label: 'Delivered', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  payment_received: { label: 'Payment Received', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  cancelled: { label: 'Cancelled', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
} as const

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [statusNote, setStatusNote] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        setOrder(data)
        setAdminNote(data.adminNote || '')
      } catch (err) {
        console.error('Failed to fetch order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleStatusChange = async (nextStatus: Order['status']) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, note: statusNote })
      })

      if (res.ok) {
        const updatedOrder = await res.json()
        setOrder(updatedOrder)
        setStatusNote('')
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAdminNote = async () => {
    if (!order) return

    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote })
      })

      if (res.ok) {
        const updatedOrder = await res.json()
        setOrder(updatedOrder)
      }
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-[#8a7060]">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-[#8a7060]">Order not found</p>
      </div>
    )
  }

  const statusColor = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const statusButtons = getStatusButtons(order.status)
  const paymentMethod = order.paymentMethod || 'cod'
  const paymentStatus = order.paymentStatus || 'pending'
  const statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : []

  return (
    <div className="admin-layout space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><button onClick={() => router.back()} className="rounded border border-[#e8d4b8] bg-white p-2 text-[#b8820a]"><ArrowLeft size={18} /></button><h1 className="text-2xl font-semibold text-[#1a0c10]">{order.orderNumber}</h1></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="admin-card border-l-4 border-l-[#b8820a] p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <KV label="Name" value={order.customer?.name} /><KV label="Phone" value={order.customer?.phone} /><KV label="Email" value={order.customer?.email || '—'} />
              <KV label="Country" value={order.customer?.country} /><KV label="Payment" value={order.paymentMethod?.toUpperCase()} />
              {order.deliveryAddress ? <div className="md:col-span-3"><p className="admin-label">Delivery Address</p><p className="text-[#1a0c10]">{order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.province}</p></div> : null}
            </div>
          </div>
          {order.type === 'giftlab' ? <GiftlabDetails order={order} /> : null}
          {order.type === 'send-to-pakistan' ? <DiasporaDetails order={order} /> : null}
          <div className="admin-card p-5"><p className="admin-label">Order Summary</p><div className="space-y-2 text-sm text-[#1a0c10]"><div className="flex justify-between"><span>Product/Subtotal</span><span>Rs {Number(order.subtotal || 0).toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>Delivery</span><span>Rs {Number(order.deliveryPrice || 0).toLocaleString('en-PK')}</span></div>{Number(order.discount || 0) > 0 ? <div className="flex justify-between"><span>Discount</span><span>-Rs {Number(order.discount).toLocaleString('en-PK')}</span></div> : null}<div className="mt-2 border-t border-[#e8d4b8] pt-2 text-[20px] font-bold text-[#b8820a]"><div className="flex justify-between"><span>TOTAL</span><span>Rs {Number(order.total || 0).toLocaleString('en-PK')}</span></div></div></div></div>
          <div className="admin-card p-5"><p className="admin-label">Admin Note</p><textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="min-h-[90px] w-full border border-[#d4c4b0] bg-white p-3 text-[#1a0c10]" /><button onClick={handleSaveAdminNote} className="mt-3 bg-[#b8820a] px-4 py-2 text-sm text-white">{saving ? 'Saving...' : 'Save Note'}</button></div>
        </div>
        <div className="space-y-4">
          <div className="admin-card p-4"><span className="block rounded border px-3 py-2 text-center text-sm" style={{ background: statusColor.bg, color: statusColor.color, borderColor: statusColor.border }}>{statusColor.label}</span><textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="Status note (optional)" className="mt-3 min-h-[70px] w-full border border-[#d4c4b0] bg-white p-2 text-sm text-[#1a0c10]" />{statusButtons.map((s) => <button key={s} onClick={() => handleStatusChange(s)} className="mt-2 w-full rounded border px-3 py-2 text-xs tracking-[0.15em]" style={s === 'cancelled' ? { borderColor: '#fecaca', color: '#991b1b', background: '#fef2f2' } : { borderColor: statusConfig[s].border, color: statusConfig[s].color, background: statusConfig[s].bg }}>{s.replace('_', ' ')}</button>)}</div>
          <div className="admin-card p-4"><KV label="Method" value={paymentMethod.toUpperCase()} /><div className="mt-2"><span className="rounded border px-2 py-1 text-xs" style={paymentStatus === 'paid' ? { color: '#166534', background: '#f0fdf4', borderColor: '#bbf7d0' } : { color: '#92670a', background: '#fef9ed', borderColor: '#f0d070' }}>{paymentStatus.toUpperCase()}</span></div>{paymentMethod === 'cod' && paymentStatus !== 'paid' ? <button onClick={() => handleStatusChange('payment_received')} className="mt-3 w-full rounded border border-[#bbf7d0] bg-[#f0fdf4] py-2 text-sm text-[#166534]">MARK PAYMENT RECEIVED</button> : null}</div>
          <div className="admin-card p-4"><button onClick={() => setHistoryOpen((v) => !v)} className="flex w-full items-center justify-between text-sm text-[#1a0c10]">Status History ({statusHistory.length}) <ChevronDown size={14} className={historyOpen ? 'rotate-180' : ''} /></button>{historyOpen ? <div className="mt-3 space-y-2">{[...statusHistory].reverse().map((h, idx) => <div key={idx} className="border-l border-[#d4c4b0] pl-3"><p className="text-xs" style={{ color: statusConfig[h.status as keyof typeof statusConfig]?.color || '#1a0c10' }}>{h.status.replace('_', ' ')}</p>{h.note ? <p className="text-[11px] italic text-[#6b5c4e]">{h.note}</p> : null}<p className="text-[10px] text-[#9a8878]">{new Date(h.timestamp).toLocaleString('en-PK')} by {h.updatedBy || 'system'}</p></div>)}</div> : null}</div>
        </div>
      </div>
    </div>
  )
}

function KV({ label, value }: { label: string; value?: string }) { return <div><p className="admin-label">{label}</p><p className="admin-value">{value || '—'}</p></div> }
function getStatusButtons(status: Order['status']) { if (status === 'pending') return ['confirmed', 'cancelled'] as const; if (status === 'confirmed') return ['packed', 'cancelled'] as const; if (status === 'packed') return ['dispatched'] as const; if (status === 'dispatched') return ['delivered', 'payment_received'] as const; if (status === 'delivered') return ['payment_received'] as const; return [] as const }

function GiftlabDetails({ order }: { order: Order }) {
  const gl = order.giftlabData
  if (!gl) return <div className="admin-card p-5 text-[#9a8878]">No GiftLab data recorded</div>
  return <div className="space-y-4"><div className="admin-card p-5"><p className="admin-label">Configuration</p><div className="grid grid-cols-2 gap-3 md:grid-cols-4"><KV label="Occasion" value={gl.occasion} /><KV label="Box" value={gl.box?.name || '—'} /><KV label="Ribbon" value={gl.ribbon} /><KV label="Delivery" value={gl.delivery} /></div></div><div className="admin-card p-5"><p className="admin-label">Items In Box ({gl.items?.length ?? 0})</p>{!gl.items?.length ? <p className="italic text-[#9a8878]">No items recorded</p> : <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{gl.items.map((item) => <div key={`${item.id}-${item.name}`} className="flex items-center gap-3 border border-[#e8d4b8] p-2"><div className="grid h-12 w-12 place-items-center bg-[#fdf8f4] text-xs">{item.imageUrl ? 'IMG' : 'BOX'}</div><div><p className="text-sm text-[#1a0c10]">{item.name}</p><p className="text-sm font-bold text-[#b8820a]">Rs {Number(item.price).toLocaleString('en-PK')}</p></div></div>)}</div>}</div><div className="admin-card p-5"><p className="admin-label">Gift Message</p><div className="relative border border-[rgba(184,130,10,0.5)] bg-[#fdf4e8] p-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(184,130,10,0.08) 28px)' }}>{!gl.message && !gl.senderName ? <p className="italic text-[#9a8878]">No gift message was written</p> : <><p className="italic text-[#2a1a14]">{gl.message}</p><div className="my-4 border-t border-[rgba(184,130,10,0.2)]" /><p className="text-sm italic text-[#9a8878]">— From: {gl.senderName || 'Anonymous'}</p></>}</div></div></div>
}

function DiasporaDetails({ order }: { order: Order }) {
  const dp = order.diasporaData
  if (!dp) return <div className="admin-card p-5 text-[#9a8878]">No diaspora data recorded</div>
  return <div className="space-y-4"><div className="admin-card border-l-4 border-l-[#b8820a] p-5"><p className="admin-label">Recipient in Pakistan</p><p className="text-2xl font-bold text-[#1a0c10]">{dp.recipient?.name || '—'}</p><p className="italic text-[#9a8878]">{dp.recipient?.relation || '—'}</p><div className="mt-3 grid grid-cols-2 gap-3"><KV label="Phone" value={dp.recipient?.phone} /><KV label="City" value={dp.recipient?.city} /><KV label="Delivery" value={dp.recipient?.deliverySlot} /><KV label="Date" value={dp.recipient?.deliveryDate ? new Date(dp.recipient.deliveryDate).toLocaleDateString('en-PK') : 'Not scheduled'} /></div>{dp.recipient?.specialInstructions ? <p className="mt-3 border border-[#e8d4b8] bg-[#fdfaf5] p-3 text-[13px] italic text-[#6b5c4e]">{dp.recipient.specialInstructions}</p> : null}</div><div className="admin-card p-5"><p className="admin-label">Gift Product</p>{dp.product ? <><p className="text-lg font-semibold text-[#1a0c10]">{dp.product.name}</p><p className="text-xl font-bold text-[#b8820a]">Rs {Number(dp.product.price || 0).toLocaleString('en-PK')}</p></> : <p className="text-[#9a8878]">No product selected</p>}</div></div>
}
