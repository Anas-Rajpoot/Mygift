'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { GiftLabSidebar } from '@/components/giftlab/sidebar'
import { fetchBoxOptions } from '@/data/categories'
import { useGiftLabStore } from '@/stores/giftlabStore'
import { BOX_OPTIONS, type BoxOption, type RibbonColor } from '@/types/giftlab'

const ribbonColors: Array<{ id: RibbonColor; hex: string }> = [
  { id: 'red', hex: '#e63946' },
  { id: 'pink', hex: '#e8899a' },
  { id: 'gold', hex: '#c9a84c' },
  { id: 'white', hex: '#fdf4e8' },
  { id: 'black', hex: '#1a1a1a' },
  { id: 'burgundy', hex: '#6b1b3d' },
]

export default function GiftLabStep2Page() {
  const router = useRouter()
  const box = useGiftLabStore((s) => s.box)
  const ribbon = useGiftLabStore((s) => s.ribbon)
  const setBox = useGiftLabStore((s) => s.setBox)
  const setRibbon = useGiftLabStore((s) => s.setRibbon)
  const setStep = useGiftLabStore((s) => s.setStep)
  const total = useGiftLabStore((s) => s.getLiveTotal())
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const [boxes, setBoxes] = useState<BoxOption[]>(BOX_OPTIONS)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    e.currentTarget.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
  }
  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
  }

  useEffect(() => {
    setStep(2)
  }, [setStep])

  useEffect(() => {
    fetchBoxOptions().then((rows) => {
      if (rows.length) setBoxes(rows)
    })
  }, [])

  return (
    <div className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-24 pt-8 text-[#fdf4e8] lg:-mt-[104px]">
      <GiftLabProgressBar />
      <div className="mx-auto mt-10 max-w-7xl lg:flex lg:gap-8">
        <section className="flex-1">
          <h1 className="font-lufga text-4xl font-light">Choose your box</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {boxes.map((option, index) => {
              const active = box?.id === option.id
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setBox(option.id)}
                  className="relative w-[200px] cursor-pointer border bg-[#1a0c10] p-4 transition"
                  style={{
                    borderColor: active ? '#c9a84c' : 'rgba(201,168,76,0.15)',
                    background: active ? 'rgba(201,168,76,0.05)' : '#1a0c10',
                  }}
                >
                  {active && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center bg-[#c9a84c] text-[#0f0608]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <GiftBoxLineArt ribbonColor={ribbonColors.find((item) => item.id === ribbon)?.hex ?? '#c9a84c'} />
                  <p className="mt-3 font-lufga text-[18px] font-bold uppercase">{option.name.replace(' Box', '')}</p>
                  <p className="font-lufga text-[11px] text-[#8a7060]">{option.dimensions}</p>
                  <p className="mt-4 font-lufga text-xs text-[rgba(253,244,232,0.5)]">Up to {option.maxItems} items</p>
                  <p className="font-lufga text-2xl font-bold text-[#c9a84c]">Rs {Number(option.basePrice).toLocaleString('en-PK')}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-10">
            <p className="font-cinzel text-[10px] tracking-[0.3em] text-[#c9a84c]">CHOOSE RIBBON COLOR</p>
            <div className="mt-4 flex gap-3">
              {ribbonColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setRibbon(color.id)}
                  className="h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: color.hex,
                    outline: ribbon === color.id ? '2px solid #fff' : 'none',
                    outlineOffset: ribbon === color.id ? '2px' : '0',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8 hidden lg:block">
          <GiftLabSidebar
            onContinue={() => {
              setStep(3)
              router.push('/giftlab/step-3')
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#c9a84c]/20 bg-[#12090b] p-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-lufga text-sm">
            {selectedItems.length} items · Rs {Number(total).toLocaleString('en-PK')} · Continue →
          </p>
          <button
            onClick={() => {
              setStep(3)
              router.push('/giftlab/step-3')
            }}
            className="bg-[#c9a84c] px-4 py-2 text-xs font-semibold text-[#0f0608]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function GiftBoxLineArt({ ribbonColor }: { ribbonColor: string }) {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" className="mx-auto">
      <rect x="20" y="44" width="80" height="42" fill="none" stroke="#c9a84c" strokeWidth="1" />
      <path d="M26 42 L98 26 L96 42 L24 58 Z" fill="none" stroke="#c9a84c" strokeWidth="1" />
      <line x1="60" y1="26" x2="60" y2="86" stroke={ribbonColor} strokeWidth="1" />
      <line x1="20" y1="62" x2="100" y2="62" stroke={ribbonColor} strokeWidth="1" />
      <path d="M60 24 C52 14, 43 30, 60 31" fill="none" stroke={ribbonColor} strokeWidth="1" />
      <path d="M60 24 C68 14, 77 30, 60 31" fill="none" stroke={ribbonColor} strokeWidth="1" />
    </svg>
  )
}
