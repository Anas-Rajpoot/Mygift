'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Eye, PackageSearch, Package, Search, ShoppingBag, TrendingUp, Truck } from 'lucide-react'
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

const paymentConfig: Record<string, { label: string; color: string }> = {
  cod: { label: 'COD', color: '#92670a' },
  jazzcash: { label: 'JazzCash', color: '#1e4db7' },
  easypaisa: { label: 'EasyPaisa', color: '#166534' },
  card: { label: 'Card', color: '#6d28d9' },
  paypal: { label: 'PayPal', color: '#0e7490' },
  wise: { label: 'Wise', color: '#0f766e' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [date, setDate] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const q = new URLSearchParams({ status, type, date, search }).toString()
    fetch(`/api/orders?${q}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.orders) ? data.orders : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [status, type, date, search])

  const todayOrders = useMemo(() => orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()), [orders])
  const pendingCOD = useMemo(() => orders.filter((o) => o.paymentMethod === 'cod' && o.paymentStatus !== 'paid'), [orders])
  const readyToPack = useMemo(() => orders.filter((o) => o.status === 'confirmed'), [orders])
  const todayRevenue = useMemo(() => todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0), [todayOrders])

  return (
    <div className="admin-layout space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ShoppingBag size={20} color="#b8820a" />} label="Orders Today" value={String(todayOrders.length)} valueColor="#1a0c10" />
        <StatCard icon={<Truck size={20} color="#92670a" />} label="Pending COD" value={String(pendingCOD.length)} valueColor="#92670a" />
        <StatCard icon={<Package size={20} color="#6d28d9" />} label="Ready to Pack" value={String(readyToPack.length)} valueColor="#6d28d9" />
        <StatCard icon={<TrendingUp size={20} color="#b8820a" />} label="Revenue Today" value={`Rs ${todayRevenue.toLocaleString('en-PK')}`} valueColor="#b8820a" />
      </div>

      <div className="admin-card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8878]" />
          <input
            className="w-full border border-[#d4c4b0] bg-white py-2 pl-9 pr-3 text-[#1a0c10]"
            placeholder="Search by order #, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="border border-[#d4c4b0] bg-white px-3 py-2 text-[#1a0c10]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>{Object.keys(statusConfig).map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select className="border border-[#d4c4b0] bg-white px-3 py-2 text-[#1a0c10]" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All Types</option><option value="giftlab">GiftLab</option><option value="send-to-pakistan">Send to Pakistan</option><option value="standard">Standard</option>
        </select>
        <select className="border border-[#d4c4b0] bg-white px-3 py-2 text-[#1a0c10]" value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="all">All Dates</option><option value="today">Today</option><option value="week">Last 7 Days</option><option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[#e8d4b8]">
        {['all', 'pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'].map((s) => (
          <button key={s} className={`px-4 py-2 text-[13px] ${status === s ? 'border-b-2 border-[#b8820a] bg-[#fdf8f4] text-[#b8820a]' : 'text-[#9a8878] hover:text-[#6b5c4e]'}`} onClick={() => setStatus(s)}>
            {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-[#e8d4b8] bg-white">
        <table className="w-full min-w-[1200px]">
          <thead className="border-b border-[#e8d4b8] bg-[#fdf6ee]">
            <tr>{['ORDER #', 'TYPE', 'CUSTOMER', 'PRODUCT/GIFT', 'AMOUNT', 'PAYMENT', 'STATUS', 'DATE', 'ACTIONS'].map((h) => <th key={h} className="px-4 py-3 text-left font-cinzel text-[9px] tracking-[0.25em] text-[#9a8878]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 6 }).map((_, idx) => <tr key={idx}><td colSpan={9} className="px-4 py-4"><div className="h-[60px] animate-pulse bg-[#f8f4f0]" /></td></tr>) : null}
            {!loading && orders.map((order) => {
              const s = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
              const p = paymentConfig[order.paymentMethod] ?? { label: order.paymentMethod, color: '#6b5c4e' }
              return (
                <tr key={order.id} className="border-b border-[#f0e8de] hover:bg-[#fdfaf6]">
                  <td className="px-4 py-4"><div className="font-semibold text-[#b8820a]">{order.orderNumber}</div><TypeBadge type={order.type} /></td>
                  <td className="px-4 py-4 text-[#1a0c10]">{order.type}</td>
                  <td className="px-4 py-4"><p className="text-[14px] font-medium text-[#1a0c10]">{order.customer?.name}</p><p className="text-[12px] text-[#6b5c4e]">{order.customer?.phone}</p></td>
                  <td className="px-4 py-4 text-[13px] text-[#1a0c10]">{getOrderItemLabel(order)}</td>
                  <td className="px-4 py-4"><p className="text-[16px] font-bold text-[#b8820a]">Rs {Number(order.total || 0).toLocaleString('en-PK')}</p>{order.type === 'send-to-pakistan' && order.diasporaData ? <p className="text-[11px] text-[#9a8878]">{order.diasporaData.buyerCurrency} {Number(order.diasporaData.foreignTotal || 0).toFixed(2)}</p> : null}</td>
                  <td className="px-4 py-4"><span className="rounded border px-2 py-1 font-cinzel text-[9px] tracking-[0.15em]" style={{ color: p.color, borderColor: `${p.color}66`, background: `${p.color}14` }}>{p.label}</span><div className="mt-2 h-1.5 w-1.5 rounded-full" style={{ background: order.paymentStatus === 'paid' ? '#16a34a' : '#b8820a' }} /></td>
                  <td className="px-4 py-4"><span className="rounded border px-3 py-1 font-cinzel text-[9px]" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span></td>
                  <td className="px-4 py-4 text-[12px] text-[#6b5c4e]">{new Date(order.createdAt).toLocaleString('en-PK', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                  <td className="px-4 py-4"><Link href={`/admin/orders/${order.id}`} className="inline-flex p-1 text-[#b8820a]"><Eye size={16} /></Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!loading && orders.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <PackageSearch size={48} color="#d4c4b0" />
            <p className="mt-3 text-2xl text-[#9a8878]">No orders yet</p>
            <p className="text-sm text-[#9a8878]">Orders will appear here when customers place them</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, valueColor }: { icon: ReactNode; label: string; value: string; valueColor: string }) {
  return <div className="admin-card p-5"><div className="flex items-start justify-between"><div><p className="text-[36px] font-bold" style={{ color: valueColor }}>{value}</p><p className="text-[13px] text-[#9a8878]">{label}</p></div>{icon}</div></div>
}

function TypeBadge({ type }: { type: Order['type'] }) {
  const styles = type === 'giftlab' ? { background: 'rgba(196,104,122,0.1)', border: 'rgba(196,104,122,0.3)', color: '#9b3a4e', label: 'GiftLab' } : type === 'send-to-pakistan' ? { background: 'rgba(30,77,183,0.1)', border: 'rgba(30,77,183,0.3)', color: '#1e4db7', label: 'Send to PK' } : { background: 'rgba(184,130,10,0.1)', border: 'rgba(184,130,10,0.3)', color: '#92670a', label: 'Standard' }
  return <span className="mt-1 inline-block rounded border px-2 py-[2px] font-cinzel text-[9px] tracking-[0.15em]" style={{ background: styles.background, borderColor: styles.border, color: styles.color }}>{styles.label}</span>
}

function getOrderItemLabel(order: Order) {
  if (order.type === 'giftlab') return `${order.giftlabData?.occasion ?? 'Gift'} - ${order.giftlabData?.box?.name ?? 'Box'}`
  if (order.type === 'send-to-pakistan') return `-> ${order.diasporaData?.recipient?.name ?? 'Recipient'}, ${order.diasporaData?.recipient?.city ?? ''}`
  return order.items?.[0]?.name || 'Standard order'
}
