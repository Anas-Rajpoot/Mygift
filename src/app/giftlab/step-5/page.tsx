'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CreditCard, Truck, Loader2, CheckCircle } from 'lucide-react'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { GiftLabSidebar } from '@/components/giftlab/sidebar'
import { useGiftLabStore } from '@/stores/giftlabStore'
import { DELIVERY_OPTIONS } from '@/lib/categories'
import { ADD_ONS } from '@/types/giftlab'

const labelStyle = {
  fontFamily: 'Cinzel, serif',
  fontSize: '10px',
  letterSpacing: '0.35em',
  color: 'rgba(201,168,76,0.7)',
  marginBottom: '8px',
  display: 'block'
}

const inputStyle = {
  width: '100%',
  background: '#1a0c10',
  border: '1px solid rgba(201,168,76,0.15)',
  color: '#fdf4e8',
  padding: '12px 16px',
  fontFamily: 'Lufga, sans-serif',
  fontSize: '13px',
  boxSizing: 'border-box'
} as const

export default function GiftLabStep5Page() {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; id: string } | null>(null)

  const box = useGiftLabStore((s) => s.box)
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const delivery = useGiftLabStore((s) => s.delivery)
  const getLiveTotal = useGiftLabStore((s) => s.getLiveTotal)
  const getItemsTotal = useGiftLabStore((s) => s.getItemsTotal)
  const getAddOnsTotal = useGiftLabStore((s) => s.getAddOnsTotal)
  const getDeliveryPrice = useGiftLabStore((s) => s.getDeliveryPrice)
  const setStep = useGiftLabStore((s) => s.setStep)
  const reset = useGiftLabStore((s) => s.reset)

  const total = getLiveTotal()
  const itemsTotal = getItemsTotal()
  const addOnsTotal = getAddOnsTotal()
  const deliveryPrice = getDeliveryPrice()

  // Form states
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'jazzcash' | 'easypaisa'>('cod')
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: ''
  })

  useEffect(() => {
    setStep(5)
  }, [setStep])

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please enter your name and phone number')
      return
    }

    setSubmitting(true)

    const state = useGiftLabStore.getState()

    const payload = {
      type: 'giftlab',
      customer: {
        name: customerInfo.name,
        email: customerInfo.email || '',
        phone: customerInfo.phone,
        country: 'PK',
      },
      deliveryAddress: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: deliveryAddress.address || '',
        city: deliveryAddress.city || '',
        province: deliveryAddress.province || '',
        country: 'PK',
      },
      subtotal:
        (state.box?.basePrice ?? 0) +
        state.selectedItems.reduce((s, i) => s + Number(i.price), 0) +
        state.selectedAddOns.reduce((s, id) => {
          const a = ADD_ONS.find((x) => x.id === id)
          return s + (a?.price ?? 0)
        }, 0),
      deliveryPrice: DELIVERY_OPTIONS.find((d) => d.id === state.delivery)?.price ?? 299,
      discount: 0,
      promoCode: null,
      total: state.getLiveTotal(),
      paymentMethod,
      giftlabData: {
        occasion: state.occasion ?? '',
        box: state.box
          ? {
              id: state.box.id,
              name: state.box.name,
              size: state.box.id,
              basePrice: state.box.basePrice,
              dimensions: state.box.dimensions ?? '',
            }
          : null,
        items: state.selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          imageUrl: (() => {
            const img = item.images?.[0]
            if (!img) return ''
            if (typeof img === 'string') return img
            if (typeof img === 'object' && 'src' in img) return img.src || ''
            return ''
          })(),
          quantity: 1,
        })),
        ribbon: state.ribbon ?? 'gold',
        message: state.message ?? '',
        senderName: state.senderName ?? '',
        cardDesign: state.cardDesign ?? 'classic',
        addOns: state.selectedAddOns.map((id) => {
          const a = ADD_ONS.find((x) => x.id === id)
          return { id, name: a?.name ?? id, price: a?.price ?? 0 }
        }),
        delivery: state.delivery ?? 'standard',
        deliveryPrice: DELIVERY_OPTIONS.find((d) => d.id === state.delivery)?.price ?? 299,
      },
      customerNote: [
        state.message ? `Gift message: "${state.message}"` : '',
        state.senderName ? `From: ${state.senderName}` : '',
      ]
        .filter(Boolean)
        .join(' | '),
    }
    console.log('[GiftLab Order Payload]', JSON.stringify(payload, null, 2))

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        setOrderResult({ orderNumber: data.orderNumber, id: data.orderId })
        setShowCelebration(true)

        const end = Date.now() + 3000
        const colors = ['#c9a84c', '#fdf4e8', '#e8c96a', '#c4687a']
        const frame = () => {
          confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors, gravity: 1.2 })
          confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors, gravity: 1.2 })
          if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()

        state.reset()
      } else {
        alert('Failed to place order: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Order failed:', err)
      alert('Error placing order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-10 pt-8 text-[#fdf4e8] lg:-mt-[104px]">
      <GiftLabProgressBar />
      <div className="mx-auto mt-10 max-w-7xl lg:flex lg:gap-8">
        <section className="flex-1 space-y-6">
          {/* Order Summary */}
          <div className="border border-[#c9a84c]/25 p-5">
            <p className="font-lufga text-xl">Order Summary</p>
            <div className="mt-4 space-y-2 font-lufga text-sm">
              <div className="flex justify-between"><span>Box ({box?.name ?? '—'})</span><span>Rs {Number(box?.basePrice ?? 0).toLocaleString('en-PK')}</span></div>
              <div className="flex justify-between"><span>Items ({selectedItems.length})</span><span>Rs {Number(itemsTotal).toLocaleString('en-PK')}</span></div>
              {addOnsTotal > 0 && <div className="flex justify-between"><span>Add-ons</span><span>Rs {Number(addOnsTotal).toLocaleString('en-PK')}</span></div>}
              <div className="flex justify-between"><span>Delivery ({delivery})</span><span>Rs {Number(deliveryPrice).toLocaleString('en-PK')}</span></div>
              <div className="border-t border-[#c9a84c]/15 pt-2 mt-2 flex justify-between font-lufga font-bold">
                <span>TOTAL</span>
                <span className="text-[#c9a84c]">Rs {Number(total).toLocaleString('en-PK')}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: 32, padding: 24, border: '1px solid rgba(201,168,76,0.15)', background: '#1a0c10' }}>
            <p style={{ fontFamily: 'Cinzel', fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(201,168,76,0.7)', marginBottom: 20 }}>YOUR DETAILS</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  placeholder="Your name"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  placeholder="03001234567"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                placeholder="your@email.com"
                type="email"
                value={customerInfo.email}
                onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))}
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: 'rgba(253,244,232,0.3)', fontStyle: 'italic', marginTop: 4 }}>
                Order confirmation will be sent here
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: 32, padding: 24, border: '1px solid rgba(201,168,76,0.15)', background: '#1a0c10' }}>
            <p style={{ fontFamily: 'Cinzel', fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(201,168,76,0.7)', marginBottom: 20 }}>DELIVERY ADDRESS</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Recipient Name</label>
                <input
                  placeholder="Who will receive this gift?"
                  style={inputStyle}
                  value={deliveryAddress.name}
                  onChange={e => setDeliveryAddress(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Recipient Phone</label>
                <input
                  placeholder="03001234567"
                  style={inputStyle}
                  value={deliveryAddress.phone}
                  onChange={e => setDeliveryAddress(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Full Address</label>
                <input
                  placeholder="Street address, building, flat number"
                  style={inputStyle}
                  value={deliveryAddress.address}
                  onChange={e => setDeliveryAddress(p => ({ ...p, address: e.target.value }))}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    placeholder="City"
                    style={inputStyle}
                    value={deliveryAddress.city}
                    onChange={e => setDeliveryAddress(p => ({ ...p, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Province</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={deliveryAddress.province}
                    onChange={e => setDeliveryAddress(p => ({ ...p, province: e.target.value }))}
                  >
                    <option value="">Select Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="AJK">AJK</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="ICT">ICT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: 'Cinzel', fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(201,168,76,0.7)', marginBottom: 20 }}>PAYMENT METHOD</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* COD */}
              <motion.div
                onClick={() => setPaymentMethod('cod')}
                whileHover={{ borderColor: 'rgba(201,168,76,0.4)' }}
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: paymentMethod === 'cod' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.15)',
                  background: paymentMethod === 'cod' ? 'rgba(201,168,76,0.06)' : '#1a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: paymentMethod === 'cod' ? '5px solid #c9a84c' : '1px solid rgba(201,168,76,0.4)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 600, fontSize: 15, color: '#fdf4e8', marginBottom: 2 }}>
                    Cash on Delivery
                  </p>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 12, color: '#8a7060' }}>
                    Pay when your gift arrives. No card needed.
                  </p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Truck size={20} color="rgba(201,168,76,0.5)" />
                </div>
              </motion.div>

              {/* JazzCash */}
              <motion.div
                onClick={() => setPaymentMethod('jazzcash')}
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: paymentMethod === 'jazzcash' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.15)',
                  background: paymentMethod === 'jazzcash' ? 'rgba(201,168,76,0.06)' : '#1a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: paymentMethod === 'jazzcash' ? '5px solid #c9a84c' : '1px solid rgba(201,168,76,0.4)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 600, fontSize: 15, color: '#fdf4e8', marginBottom: 2 }}>
                    JazzCash
                  </p>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 12, color: '#8a7060' }}>
                    Pay via JazzCash mobile wallet
                  </p>
                </div>
              </motion.div>

              {/* EasyPaisa */}
              <motion.div
                onClick={() => setPaymentMethod('easypaisa')}
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: paymentMethod === 'easypaisa' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.15)',
                  background: paymentMethod === 'easypaisa' ? 'rgba(201,168,76,0.06)' : '#1a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: paymentMethod === 'easypaisa' ? '5px solid #c9a84c' : '1px solid rgba(201,168,76,0.4)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 600, fontSize: 15, color: '#fdf4e8', marginBottom: 2 }}>
                    EasyPaisa
                  </p>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 12, color: '#8a7060' }}>
                    Pay via EasyPaisa mobile wallet
                  </p>
                </div>
              </motion.div>

              {/* Card */}
              <motion.div
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: paymentMethod === 'card' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,0.15)',
                  background: paymentMethod === 'card' ? 'rgba(201,168,76,0.06)' : '#1a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: paymentMethod === 'card' ? '5px solid #c9a84c' : '1px solid rgba(201,168,76,0.4)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 600, fontSize: 15, color: '#fdf4e8', marginBottom: 2 }}>
                    Credit / Debit Card
                  </p>
                  <p style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 12, color: '#8a7060' }}>
                    Visa, Mastercard, Amex
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {['VISA', 'MC', 'AMEX'].map(b => (
                    <span
                      key={b}
                      style={{
                        border: '1px solid rgba(201,168,76,0.2)',
                        padding: '2px 6px',
                        fontSize: 9,
                        fontFamily: 'Cinzel',
                        color: 'rgba(201,168,76,0.5)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* COD notice */}
            {paymentMethod === 'cod' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 12,
                  padding: '12px 16px',
                  background: 'rgba(90,170,122,0.08)',
                  border: '1px solid rgba(90,170,122,0.2)',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start'
                }}
              >
                <CheckCircle size={14} color="#5aaa7a" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 12, color: 'rgba(90,170,122,0.9)', lineHeight: 1.6 }}>
                  Your order will be confirmed immediately. Pay in cash when the gift is delivered. Our team will call to confirm before dispatch.
                </p>
              </motion.div>
            )}
          </div>

          {/* Place Order Button */}
          <motion.button
            onClick={handlePlaceOrder}
            disabled={submitting || !customerInfo.name || !customerInfo.phone}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              height: 56,
              background: submitting || !customerInfo.name || !customerInfo.phone ? 'rgba(201,168,76,0.5)' : '#c9a84c',
              color: '#0f0608',
              border: 'none',
              cursor: submitting || !customerInfo.name || !customerInfo.phone ? 'not-allowed' : 'pointer',
              fontFamily: 'Lufga',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.25em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'background 0.2s',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                PLACING ORDER...
              </>
            ) : paymentMethod === 'cod' ? (
              <>
                <Truck size={16} />
                PLACE ORDER — CASH ON DELIVERY
              </>
            ) : (
              <>
                <CreditCard size={16} />
                PLACE ORDER — Rs {total.toLocaleString('en-PK')}
              </>
            )}
          </motion.button>

          {/* Validation message */}
          {(!customerInfo.name || !customerInfo.phone) && (
            <p style={{
              fontFamily: 'Lufga',
              fontWeight: 300,
              fontSize: 12,
              color: 'rgba(196,104,122,0.8)',
              textAlign: 'center',
              marginTop: 8,
              fontStyle: 'italic'
            }}>
              Please enter your name and phone number to continue
            </p>
          )}
        </section>

        <div className="mt-8 hidden lg:block">
          <GiftLabSidebar showContinue={false} />
        </div>
      </div>

      {/* Success Celebration */}
      <AnimatePresence>
        {showCelebration && orderResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15,6,8,0.96)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <motion.svg width="80" height="80" viewBox="0 0 80 80">
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="#c9a84c"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M24 40 L35 51 L56 30"
                stroke="#c9a84c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cinzel,serif', fontSize: '11px', letterSpacing: '0.4em', color: '#c9a84c', marginBottom: '16px' }}>ORDER CONFIRMED</p>
              <h2 style={{ fontFamily: 'Lufga,serif', fontWeight: 300, fontSize: '48px', color: '#fdf4e8', lineHeight: 1.1, marginBottom: '12px' }}>
                Thank you for
                <br />
                your beautiful gift
              </h2>
              <p style={{ fontFamily: 'Lufga,sans-serif', fontWeight: 300, fontSize: '16px', color: '#8a7060', marginBottom: '32px', lineHeight: 1.7 }}>
                Order #{orderResult.orderNumber}
                <br />
                Someone special is about to feel very loved.
              </p>
              <div style={{ border: '1px solid rgba(201,168,76,0.3)', padding: '16px 32px', marginBottom: '32px', display: 'inline-block' }}>
                <p style={{ color: '#8a7060', fontSize: '12px', letterSpacing: '0.2em' }}>TOTAL ORDER VALUE</p>
                <p style={{ color: '#c9a84c', fontSize: '32px', fontWeight: 700, fontFamily: 'Lufga' }}>Rs {Number(total).toLocaleString('en-PK')}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    router.push('/account/orders')
                  }}
                  style={{ background: '#c9a84c', color: '#0f0608', padding: '14px 40px', border: 'none', fontFamily: 'Lufga', fontWeight: 600, fontSize: '12px', letterSpacing: '0.2em', cursor: 'pointer' }}
                >
                  VIEW ORDER
                </button>
                <button
                  onClick={() => {
                    setShowCelebration(false)
                    reset()
                    router.push('/giftlab/step-1')
                  }}
                  style={{ background: 'none', color: '#fdf4e8', padding: '14px 40px', border: '1px solid rgba(253,244,232,0.2)', fontFamily: 'Lufga', fontWeight: 300, fontSize: '12px', letterSpacing: '0.2em', cursor: 'pointer' }}
                >
                  BUILD ANOTHER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
