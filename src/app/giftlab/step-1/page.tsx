'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Cake, Flower2, Heart, HeartHandshake, Sparkles, Star } from 'lucide-react'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { useGiftLabStore } from '@/stores/giftlabStore'

const cards = [
  { id: 'birthday', name: 'Birthday', count: 48, accent: '#c4687a', bg: 'radial-gradient(ellipse at 50% 100%, #7a1a3a 0%, #1a0608 70%)', Icon: Cake },
  { id: 'anniversary', name: 'Anniversary', count: 32, accent: '#c9a84c', bg: 'radial-gradient(ellipse at 50% 100%, #6b3a15 0%, #1a0c06 70%)', Icon: Heart },
  { id: 'eid', name: 'Eid', count: 36, accent: '#7fd18f', bg: 'radial-gradient(ellipse at 50% 100%, #1a4a25 0%, #061a0a 70%)', Icon: Star },
  { id: 'wedding', name: 'Wedding', count: 24, accent: '#85a7ff', bg: 'radial-gradient(ellipse at 50% 100%, #1a2a5c 0%, #060a1a 70%)', Icon: Sparkles },
  { id: 'mothers-day', name: "Mother's Day", count: 19, accent: '#c468b1', bg: 'radial-gradient(ellipse at 50% 100%, #5c1a4a 0%, #1a0615 70%)', Icon: Flower2 },
  { id: 'valentines-day', name: "Valentine's", count: 27, accent: '#da6d7b', bg: 'radial-gradient(ellipse at 50% 100%, #6b1b1b 0%, #1a0606 70%)', Icon: HeartHandshake },
] as const

export default function GiftLabStep1Page() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const setOccasion = useGiftLabStore((s) => s.setOccasion)
  const setStep = useGiftLabStore((s) => s.setStep)

  useEffect(() => {
    setStep(1)
  }, [setStep])

  return (
    <div
      className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-16 pt-10 text-[#fdf4e8] lg:-mt-[104px]"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, #3d0f1e 0%, #0f0608 55%)' }}
    >
      <GiftLabProgressBar />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
        <div className="mx-auto mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#c9a84c]/40" />
          <p className="font-cinzel text-[11px] tracking-[0.5em] text-[#c9a84c]">BUILD YOUR PERFECT GIFT</p>
          <span className="h-px w-10 bg-[#c9a84c]/40" />
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center font-lufga text-4xl font-light md:text-[56px]"
      >
        Choose your occasion
      </motion.h1>

      <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{
              opacity: selected && selected !== card.id ? 0.3 : 1,
              y: 0,
              scale: selected === card.id ? [1, 1.04, 0.97] : selected && selected !== card.id ? 0.95 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelected(card.id)
              setOccasion(card.id)
              setStep(2)
              setTimeout(() => router.push('/giftlab/step-2'), 500)
            }}
            className="relative min-h-[220px] cursor-pointer overflow-hidden border"
            style={{ borderColor: 'rgba(201,168,76,0.08)', background: card.bg }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,2,4,0.7)] to-transparent" />
            <div className="absolute bottom-7 left-0 right-0 text-center">
              <motion.div whileHover={{ y: -6, scale: 1.1 }} transition={{ duration: 0.3 }} className="mx-auto w-fit">
                <card.Icon className="mx-auto h-9 w-9" style={{ color: card.accent }} />
              </motion.div>
              <p className="mt-3 font-lufga text-[26px] font-bold">{card.name}</p>
              <p className="mt-1 font-lufga text-[11px] font-light tracking-[0.15em] text-[#8a7060]">{card.count} gifts curated</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
