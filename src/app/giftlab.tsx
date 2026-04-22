'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { stepVariants } from '@/lib/animations'
import { OCCASIONS } from '@/lib/occasions'
import { BOX_OPTIONS } from '@/types/giftlab'
import type { Occasion, ProductCategory } from '@/types/product'
import type { BoxSize, RibbonColor } from '@/types/giftlab'

const MOCK_PRODUCTS_GIFT = [
  { id: 1, name: 'Premium Chocolates', price: 2500, category: 'gifts-hampers' as ProductCategory },
  { id: 2, name: 'Rose Perfume Set', price: 3200, category: 'gifts-hampers' as ProductCategory },
  { id: 3, name: 'Silk Scarf', price: 1800, category: 'clothing' as ProductCategory },
  { id: 4, name: 'Luxury Watch', price: 8500, category: 'watches-accessories' as ProductCategory },
]

const RIBBON_COLORS: { id: RibbonColor; name: string; hex: string }[] = [
  { id: 'red', name: 'Red', hex: '#e63946' },
  { id: 'pink', name: 'Pink', hex: '#e8899a' },
  { id: 'gold', name: 'Gold', hex: '#c9a84c' },
  { id: 'white', name: 'White', hex: '#fdf4e8' },
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'burgundy', name: 'Burgundy', hex: '#6b1b3d' },
]

function ProgressBar({ step }: { step: number }) {
  const steps = [
    { num: 1, label: 'Occasion' },
    { num: 2, label: 'Box' },
    { num: 3, label: 'Items' },
    { num: 4, label: 'Personalize' },
    { num: 5, label: 'Review' },
  ]

  return (
    <div className="py-8 px-6 border-b border-gold/15">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-lufga font-semibold transition-all ${
                s.num <= step ? 'bg-gold text-ink' : 'border border-gold/30 text-cream'
              }`}>
                {s.num}
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-all ${
                  s.num < step ? 'bg-gold' : 'bg-gold/15'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {steps.map(s => (
            <span key={s.num} className={`font-lufga text-xs uppercase tracking-wider ${
              s.num <= step ? 'text-gold' : 'text-muted'
            }`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GiftLabPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [occasion, setOccasion] = useState<Occasion | null>(null)
  const [box, setBox] = useState<BoxSize | null>(null)
  const [selectedItems, setSelectedItems] = useState<typeof MOCK_PRODUCTS_GIFT>([])
  const [ribbon, setRibbon] = useState<RibbonColor>('gold')

  const nextStep = () => {
    setDirection(1)
    setStep(prev => (prev === 5 ? 5 : (prev + 1) as any))
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(prev => (prev === 1 ? 1 : (prev - 1) as any))
  }

  return (
    <div className="bg-ink min-h-screen">
      <ProgressBar step={step} />

      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Choose Occasion</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {OCCASIONS.map(occ => (
                    <motion.button
                      key={occ.id}
                      onClick={() => {
                        setOccasion(occ.id)
                        nextStep()
                      }}
                      className="p-6 border border-gold/15 hover:border-gold/40 rounded-lg transition-all text-left min-h-[200px] flex flex-col justify-between"
                      style={{ background: `radial-gradient(ellipse at 30% 50%, ${occ.glowColor}44 0%, transparent 70%)` }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(201,168,76,0.4)' }}
                    >
                      <div className="text-4xl mb-4">🎁</div>
                      <div>
                        <h3 className="font-lufga font-bold text-2xl text-cream">{occ.name}</h3>
                        <p className="font-lufga text-xs text-muted mt-2">{occ.productCount} gifts curated</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Choose Box Size</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {BOX_OPTIONS.map(opt => (
                    <motion.button
                      key={opt.id}
                      onClick={() => setBox(opt.id)}
                      className={`p-6 border-2 rounded-lg transition-all text-center ${
                        box === opt.id ? 'border-gold bg-gold/10' : 'border-gold/15 hover:border-gold/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl mb-4">📦</div>
                      <h3 className="font-lufga font-semibold text-cream mb-2">{opt.name}</h3>
                      <p className="font-lufga text-xs text-muted mb-3">Up to {opt.maxItems} items</p>
                      <p className="font-lufga font-bold text-lg text-gold">₨{opt.basePrice.toLocaleString('en-PK')}</p>
                      <p className="font-lufga text-xs text-muted mt-2">{opt.dimensions}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gold/15">
                  <h3 className="font-lufga font-semibold text-cream mb-4">Choose Ribbon Color</h3>
                  <div className="flex gap-4">
                    {RIBBON_COLORS.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setRibbon(r.id)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          ribbon === r.id ? 'border-gold scale-110' : 'border-gold/30'
                        }`}
                        style={{ backgroundColor: r.hex }}
                        title={r.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gold/15">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gold text-cream font-lufga">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-ink font-lufga font-semibold hover:bg-gold-light">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Select Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_PRODUCTS_GIFT.map(prod => {
                    const isSelected = selectedItems.some(s => s.id === prod.id)
                    return (
                      <motion.button
                        key={prod.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedItems(selectedItems.filter(s => s.id !== prod.id))
                          } else {
                            setSelectedItems([...selectedItems, prod])
                          }
                        }}
                        className={`p-6 border-2 rounded-lg transition-all text-left ${
                          isSelected ? 'border-gold bg-gold/10' : 'border-gold/15 hover:border-gold/40'
                        }`}
                      >
                        <h3 className="font-lufga font-semibold text-cream mb-2">{prod.name}</h3>
                        <p className="font-lufga font-bold text-lg text-gold">₨{prod.price.toLocaleString('en-PK')}</p>
                        {isSelected && <div className="text-sm text-gold mt-3">✓ Added</div>}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gold/15">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gold text-cream font-lufga">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep} disabled={selectedItems.length === 0} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-ink font-lufga font-semibold hover:bg-gold-light disabled:opacity-50">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8 max-w-2xl"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Personalize</h2>
                
                <div className="space-y-4">
                  <label className="block font-lufga font-semibold text-cream">Your Message</label>
                  <textarea
                    className="w-full p-4 bg-surface border border-gold/30 text-cream font-lufga placeholder-muted/50 rounded-lg focus:border-gold outline-none"
                    rows={6}
                    placeholder="Write a personal message..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-lufga font-semibold text-cream">From</label>
                  <input
                    type="text"
                    className="w-full p-4 bg-surface border border-gold/30 text-cream font-lufga placeholder-muted/50 rounded-lg focus:border-gold outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gold/15">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gold text-cream font-lufga">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-ink font-lufga font-semibold hover:bg-gold-light">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8 max-w-2xl"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Review Your Gift</h2>
                
                <div className="space-y-6 p-6 bg-surface-2 border border-gold/15 rounded-lg">
                  <div className="space-y-2">
                    <p className="font-lufga text-sm text-muted">Occasion</p>
                    <p className="font-lufga font-semibold text-lg text-cream">{occasion}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-lufga text-sm text-muted">Box</p>
                    <p className="font-lufga font-semibold text-lg text-cream">{box}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-lufga text-sm text-muted">Items Selected</p>
                    <div className="space-y-1">
                      {selectedItems.map(item => (
                        <p key={item.id} className="font-lufga text-cream">• {item.name} - ₨{item.price.toLocaleString('en-PK')}</p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gold/15 pt-4">
                    <p className="font-lufga font-bold text-xl text-gold">
                      Total: ₨{(selectedItems.reduce((sum, i) => sum + i.price, 0) + (BOX_OPTIONS.find(b => b.id === box)?.basePrice || 0)).toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gold/15">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gold text-cream font-lufga">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button className="flex-1 px-6 py-4 bg-gold text-ink font-lufga font-semibold text-lg hover:bg-gold-light">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
