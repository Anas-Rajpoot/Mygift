'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Globe, CreditCard, Wallet, Banknote } from 'lucide-react'
import { stepVariants } from '@/lib/animations'
import { PK_CITIES, DIASPORA_COUNTRIES } from '@/lib/pakistan'
import type { ProductCategory } from '@/types/product'

const MOCK_DIASPORA_PRODUCTS = [
  { id: 1, name: 'Luxury Hamper', price: 11200, regularPrice: 12800, category: 'gifts-hampers' as ProductCategory, description: 'Premium gift set' },
  { id: 2, name: 'Designer Watch', price: 15000, regularPrice: 18000, category: 'watches-accessories' as ProductCategory, description: 'Luxury timepiece' },
  { id: 3, name: 'Silk Collection', price: 4500, regularPrice: 6000, category: 'clothing' as ProductCategory, description: 'Traditional wear' },
]

const GIFT_CATEGORIES = [
  { id: 'gifts-hampers', name: 'Gifts & Hampers', icon: '🎁' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'watches-accessories', name: 'Watches & Accessories', icon: '⌚' },
  { id: 'flowers-cakes', name: 'Flowers & Cakes', icon: '🌹' },
  { id: 'digital', name: 'Digital Products', icon: '💳' },
  { id: 'giftlab', name: 'Custom GiftLab', icon: '🎨' },
]

function Step1Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="space-y-6">
          <p className="font-cinzel text-xs uppercase tracking-widest text-gold">For Pakistanis Worldwide</p>
          <h1 className="font-lufga font-light text-6xl leading-tight text-cream">
            Send your love<br />home to Pakistan
          </h1>
          <p className="font-lufga font-light text-lg text-muted">
            Order from anywhere. We deliver to your family — same day in major cities.
          </p>
          <div className="flex gap-6 flex-wrap">
            {DIASPORA_COUNTRIES.map(country => (
              <div key={country.currency} className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold" />
                <span className="font-lufga text-sm text-cream">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-80 bg-gradient-radial from-gold/10 to-transparent rounded-lg flex items-center justify-center">
          <div className="text-6xl">🌍</div>
        </div>
      </div>

      <div className="border-t border-gold/15 pt-12">
        <h2 className="font-lufga font-semibold text-2xl text-cream mb-8">What would you like to send?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GIFT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="p-8 border border-gold/15 hover:border-gold/40 rounded-lg text-left transition-all hover:bg-gold/5"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-lufga font-semibold text-lg text-cream mb-2">{cat.name}</h3>
              <p className="font-lufga text-xs text-muted">Ships same day</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DiasporaPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  const nextStep = () => {
    setDirection(1)
    setStep(prev => (prev === 5 ? 5 : (prev + 1) as any))
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(prev => (prev === 1 ? 1 : (prev - 1) as any))
  }

  return (
    <div className="bg-ink min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 50%, #3d0f1e 0%, #0f0608 60%)'
    }}>
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12 pb-8 border-b border-gold/15">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-lufga font-semibold transition-all ${
                  s <= step ? 'bg-gold text-ink' : 'border border-gold/30 text-cream'
                }`}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <Step1Hero />
                <div className="flex gap-4 mt-12 pt-8 border-t border-gold/15">
                  <button onClick={nextStep} className="flex-1 px-6 py-4 bg-gold text-ink font-lufga font-semibold text-lg hover:bg-gold-light flex items-center justify-center gap-2">
                    Start Sending <ChevronRight className="w-4 h-4" />
                  </button>
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
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Choose a Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_DIASPORA_PRODUCTS.map(prod => (
                    <div key={prod.id} className="p-6 border border-gold/15 hover:border-gold/40 rounded-lg cursor-pointer transition-all">
                      <div className="w-full aspect-video bg-gold/10 rounded-lg mb-4" />
                      <h3 className="font-lufga font-semibold text-lg text-cream mb-2">{prod.name}</h3>
                      <p className="font-lufga text-sm text-muted mb-4">{prod.description}</p>
                      <div className="flex justify-between items-baseline">
                        <p className="font-lufga font-bold text-xl text-gold">₨{prod.price.toLocaleString('en-PK')}</p>
                        <p className="font-lufga text-xs text-muted line-through">₨{prod.regularPrice.toLocaleString('en-PK')}</p>
                      </div>
                    </div>
                  ))}
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
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Recipient Details</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-lufga font-semibold text-cream mb-2">Recipient Name</label>
                      <input type="text" className="w-full p-3 bg-surface border border-gold/30 text-cream font-lufga rounded-lg focus:border-gold outline-none" />
                    </div>
                    <div>
                      <label className="block font-lufga font-semibold text-cream mb-2">Phone Number</label>
                      <div className="flex">
                        <span className="px-3 py-3 bg-surface-2 border border-gold/30 border-r-0 font-lufga text-muted">+92</span>
                        <input type="text" className="flex-1 p-3 bg-surface border border-gold/30 text-cream font-lufga rounded-r-lg focus:border-gold outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-lufga font-semibold text-cream mb-2">Relationship</label>
                      <select className="w-full p-3 bg-surface border border-gold/30 text-cream font-lufga rounded-lg focus:border-gold outline-none">
                        <option>Select relationship</option>
                        <option>Mother</option>
                        <option>Father</option>
                        <option>Sister</option>
                        <option>Brother</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block font-lufga font-semibold text-cream mb-4">Select City</label>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {PK_CITIES.map(city => (
                        city.id !== 'other' && (
                          <button key={city.id} className="p-4 border border-gold/15 hover:border-gold/40 rounded-lg text-left transition-all">
                            <p className="font-lufga font-semibold text-cream">{city.name}</p>
                            {city.sameDay && <p className="font-lufga text-xs text-gold">Same-day available</p>}
                          </button>
                        )
                      ))}
                    </div>
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

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8 max-w-2xl mx-auto"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Gift Note</h2>
                
                <div className="space-y-4">
                  <label className="block font-lufga font-semibold text-cream">Message</label>
                  <textarea
                    className="w-full p-6 bg-cream text-ink font-lufga font-light text-lg placeholder-muted/50 rounded-lg focus:outline-gold outline-none"
                    rows={8}
                    placeholder="Write your personal message..."
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(201,168,76,0.15) 28px)',
                      backgroundSize: '100% 28px'
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-lufga font-semibold text-cream">From</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-surface border border-gold/30 text-cream font-lufga rounded-lg focus:border-gold outline-none"
                    placeholder="Your name"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-gold/30 rounded-lg cursor-pointer hover:bg-gold/5">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-lufga text-cream">Notify on WhatsApp when gift is out for delivery</span>
                </label>

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
                className="space-y-8 max-w-2xl mx-auto"
              >
                <h2 className="font-lufga font-bold text-4xl text-cream mb-8">Payment</h2>
                
                <div className="space-y-4 p-6 bg-surface-2 border border-gold/15 rounded-lg mb-8">
                  <p className="font-lufga font-semibold text-cream">Order Summary</p>
                  <div className="flex justify-between font-lufga text-sm text-muted">
                    <span>Product</span>
                    <span>₨11,200</span>
                  </div>
                  <div className="flex justify-between font-lufga text-sm text-muted">
                    <span>Delivery</span>
                    <span>₨299</span>
                  </div>
                  <div className="border-t border-gold/15 pt-3 flex justify-between font-lufga font-bold text-gold">
                    <span>Total</span>
                    <span>₨11,499</span>
                  </div>
                  <div className="pt-3 font-lufga text-xs text-muted">
                    You'll pay £32.80 · Rate: 1 GBP = 350 PKR
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-lufga font-semibold text-cream mb-4">Select Payment Method</p>
                  {[
                    { icon: CreditCard, name: 'Card / Stripe' },
                    { icon: Wallet, name: 'PayPal' },
                    { icon: Banknote, name: 'Wise Transfer' },
                  ].map((method, i) => (
                    <button key={i} className="w-full p-4 border border-gold/15 hover:border-gold/40 rounded-lg flex items-center gap-4 transition-all">
                      <method.icon className="w-6 h-6 text-gold" />
                      <span className="font-lufga font-semibold text-cream">{method.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gold/15">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border border-gold text-cream font-lufga">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button className="flex-1 px-6 py-4 bg-gold text-ink font-lufga font-semibold text-lg hover:bg-gold-light">
                    Complete Payment
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
