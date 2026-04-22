'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { GiftLabSidebar } from '@/components/giftlab/sidebar'
import { useGiftLabStore } from '@/stores/giftlabStore'
import { useCartStore } from '@/stores/cartStore'

export default function GiftLabStep5Page() {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle')

  const box = useGiftLabStore((s) => s.box)
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const selectedAddOns = useGiftLabStore((s) => s.selectedAddOns)
  const delivery = useGiftLabStore((s) => s.delivery)
  const getLiveTotal = useGiftLabStore((s) => s.getLiveTotal)
  const getItemsTotal = useGiftLabStore((s) => s.getItemsTotal)
  const getAddOnsTotal = useGiftLabStore((s) => s.getAddOnsTotal)
  const getDeliveryPrice = useGiftLabStore((s) => s.getDeliveryPrice)
  const setStep = useGiftLabStore((s) => s.setStep)

  const total = getLiveTotal()
  const itemsTotal = getItemsTotal()
  const addOnsTotal = getAddOnsTotal()
  const deliveryPrice = getDeliveryPrice()

  useEffect(() => {
    setStep(5)
  }, [setStep])

  const handleAddToCart = async () => {
    const state = useGiftLabStore.getState()
    const addToCart = useCartStore.getState().addItem

    const cartItem = {
      id: `giftlab-${Date.now()}`,
      name: `Custom ${state.occasion} Gift Box`,
      price: state.getLiveTotal(),
      quantity: 1,
      type: 'giftlab' as const,
      giftlabData: {
        box: state.box,
        items: state.selectedItems,
        ribbon: state.ribbon,
        message: state.message,
        senderName: state.senderName,
        addOns: state.selectedAddOns,
        delivery: state.delivery,
      },
    }

    addToCart(cartItem)
    setButtonState('loading')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setButtonState('success')
    setShowCelebration(true)

    const end = Date.now() + 3000
    const colors = ['#c9a84c', '#fdf4e8', '#e8c96a', '#c4687a']
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors, gravity: 1.2 })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors, gravity: 1.2 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  return (
    <div className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-10 pt-8 text-[#fdf4e8] lg:-mt-[104px]">
      <GiftLabProgressBar />
      <div className="mx-auto mt-10 max-w-7xl lg:flex lg:gap-8">
        <section className="flex-1 space-y-6">
          <div className="border border-[#c9a84c]/25 p-5">
            <p className="font-lufga text-xl">Review</p>
            <div className="mt-4 space-y-2 font-lufga text-sm">
              <div className="flex justify-between"><span>Box ({box?.name ?? '—'})</span><span>Rs {Number(box?.basePrice ?? 0).toLocaleString('en-PK')}</span></div>
              <div className="flex justify-between"><span>Items ({selectedItems.length})</span><span>Rs {Number(itemsTotal).toLocaleString('en-PK')}</span></div>
              {addOnsTotal > 0 && <div className="flex justify-between"><span>Add-ons</span><span>Rs {Number(addOnsTotal).toLocaleString('en-PK')}</span></div>}
              <div className="flex justify-between"><span>Delivery ({delivery})</span><span>Rs {Number(deliveryPrice).toLocaleString('en-PK')}</span></div>
            </div>
          </div>
          <button onClick={handleAddToCart} className="h-14 w-full bg-[#c9a84c] font-lufga text-xs font-semibold tracking-[0.2em] text-[#0f0608]">
            {buttonState === 'loading' ? 'ADDING...' : buttonState === 'success' ? 'ADDED' : 'ADD TO CART'}
          </button>
        </section>
        <div className="mt-8 hidden lg:block">
          <GiftLabSidebar showContinue={false} />
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
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
                Your custom gift box has been added to cart.
                <br />
                Someone special is about to feel very loved.
              </p>
              <div style={{ border: '1px solid rgba(201,168,76,0.3)', padding: '16px 32px', marginBottom: '32px', display: 'inline-block' }}>
                <p style={{ color: '#8a7060', fontSize: '12px', letterSpacing: '0.2em' }}>TOTAL ADDED TO CART</p>
                <p style={{ color: '#c9a84c', fontSize: '32px', fontWeight: 700, fontFamily: 'Lufga' }}>Rs {Number(total).toLocaleString('en-PK')}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => router.push('/cart')}
                  style={{ background: '#c9a84c', color: '#0f0608', padding: '14px 40px', border: 'none', fontFamily: 'Lufga', fontWeight: 600, fontSize: '12px', letterSpacing: '0.2em', cursor: 'pointer' }}
                >
                  VIEW CART
                </button>
                <button
                  onClick={() => {
                    setShowCelebration(false)
                    useGiftLabStore.getState().reset()
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
    </div>
  )
}
