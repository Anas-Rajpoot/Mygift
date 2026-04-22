'use client'

import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { DELIVERY_OPTIONS } from '@/lib/categories'
import { useGiftLabStore } from '@/stores/giftlabStore'

interface GiftLabSidebarProps {
  onContinue?: () => void
  showContinue?: boolean
}

export function GiftLabSidebar({ onContinue, showContinue = true }: GiftLabSidebarProps) {
  const box = useGiftLabStore((s) => s.box)
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const delivery = useGiftLabStore((s) => s.delivery)
  const getItemsTotal = useGiftLabStore((s) => s.getItemsTotal)
  const getAddOnsTotal = useGiftLabStore((s) => s.getAddOnsTotal)
  const getDeliveryPrice = useGiftLabStore((s) => s.getDeliveryPrice)
  const getLiveTotal = useGiftLabStore((s) => s.getLiveTotal)

  const itemsTotal = getItemsTotal()
  const addOnsTotal = getAddOnsTotal()
  const deliveryPrice = getDeliveryPrice()
  const total = getLiveTotal()
  const springValue = useSpring(total, { stiffness: 300, damping: 30 })
  const displayValue = useTransform(springValue, (v) => `Rs ${Math.round(v).toLocaleString('en-PK')}`)
  useEffect(() => {
    springValue.set(total)
  }, [springValue, total])

  const capacity = box ? Math.min(100, (selectedItems.length / box.maxItems) * 100) : 0
  const isFull = box ? selectedItems.length >= box.maxItems : false
  const deliveryText = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.label ?? 'Same-day delivery'

  return (
    <aside className="w-full border border-[#c9a84c]/20 bg-[#15090c] p-4 lg:w-[320px]">
      <div id="giftlab-sidebar-thumb-target" className="grid grid-cols-4 gap-2">
        {selectedItems.slice(0, 8).map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="aspect-square border border-[#c9a84c]/30 bg-[#0f0608]" />
        ))}
      </div>
      <div className="mt-4">
        <p className="font-lufga text-xs text-[#8a7060]">
          {box ? `${selectedItems.length} / ${box.maxItems} items` : 'Choose a box first'}
        </p>
        {box && (
          <>
            <div className="mt-2 h-2 bg-[#2a1319]">
              <div
                className="h-full transition-all"
                style={{ width: `${capacity}%`, backgroundColor: isFull ? '#c4687a' : '#c9a84c' }}
              />
            </div>
            <p className={`mt-2 font-lufga text-xs ${isFull ? 'text-[#c4687a]' : 'text-[#8a7060]'}`}>
              {isFull ? 'Box is full!' : 'Capacity available'}
            </p>
          </>
        )}
      </div>
      <div className="mt-5 space-y-1 text-sm">
        <AnimatedPriceLine label={`Box (${box?.name ?? '—'})`} value={box?.basePrice ?? 0} />
        <AnimatedPriceLine label={`Items (${selectedItems.length})`} value={itemsTotal} />
        {addOnsTotal > 0 && <AnimatedPriceLine label="Add-ons" value={addOnsTotal} />}
        <AnimatedPriceLine label={`Delivery (${deliveryText})`} value={deliveryPrice} />
      </div>
      <div className="my-3 border-t border-[#c9a84c]/25" />
      <div className="flex items-center justify-between">
        <span className="font-lufga text-sm text-[#fdf4e8]">Total</span>
        <motion.span className="font-lufga text-xl font-bold text-[#c9a84c]">{displayValue}</motion.span>
      </div>
      {showContinue && (
        <button onClick={onContinue} className="mt-5 w-full bg-[#c9a84c] py-2 font-lufga text-xs font-semibold tracking-[0.18em] text-[#0f0608]">
          CONTINUE →
        </button>
      )}
    </aside>
  )
}

function AnimatedPriceLine({ label, value }: { label: string; value: number }) {
  const springValue = useSpring(value, { stiffness: 300, damping: 30 })
  const displayValue = useTransform(springValue, (v) => `Rs ${Math.round(v).toLocaleString('en-PK')}`)
  useEffect(() => {
    springValue.set(value)
  }, [springValue, value])

  return (
    <div className="flex items-center justify-between font-lufga text-[#8a7060]">
      <span>{label}</span>
      <motion.span>{displayValue}</motion.span>
    </div>
  )
}
