'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import { Banknote, Calendar, Check, CheckCircle2, ChevronDown, CreditCard, Download, Flower2, Gift, Globe, Lock, MapPin, MessageCircle, Package, PackageX, Phone, Shirt, ShoppingBag, ShoppingCart, Sparkles, Upload, Wallet, Watch } from 'lucide-react'
import { stepVariants } from '@/lib/animations'
import { fetchDiasporaCategories, fetchDiasporaProducts } from '@/app/actions/diaspora-products'
import { LuxuryDatePicker } from '@/components/ui'
import { useDiasporaStore, type DiasporaProduct } from '@/stores/diasporaStore'
import { useCartStore } from '@/stores/cartStore'

const categories = [
  { id: 'gifts-hampers', name: 'Gifts & Hampers', icon: Gift, desc: 'Chocolates, hampers, luxury boxes', accent: '#c4687a' },
  { id: 'clothing', name: 'Clothing & Fashion', icon: Shirt, desc: 'Lawn suits, kurtas, shalwar kameez', accent: '#c9a84c' },
  { id: 'watches-accessories', name: 'Watches & Accessories', icon: Watch, desc: 'For him & for her', accent: '#7ab8d4' },
  { id: 'flowers-cakes', name: 'Flowers & Cakes', icon: Flower2, desc: 'Fresh bouquets, custom cakes', accent: '#a8d48a' },
  { id: 'digital', name: 'Digital Gift Cards', icon: Download, desc: 'Instant delivery to their phone', accent: '#8a7060' },
  { id: 'custom', name: 'Build Custom Gift', icon: Sparkles, desc: 'Design it yourself in GiftLab', accent: '#c9a84c' },
] as const

const cities = [
  { name: 'Karachi', same: true }, { name: 'Lahore', same: true }, { name: 'Islamabad', same: true }, { name: 'Multan', same: true },
  { name: 'Peshawar', same: false }, { name: 'Faisalabad', same: false }, { name: 'Rawalpindi', same: false }, { name: 'Quetta', same: false },
] as const

const packingOptions = [
  { id: 'standard', name: 'Standard Packing', desc: 'Basic gift wrapping', price: 0, Icon: Package },
  { id: 'premium', name: 'Premium Gift Box', desc: 'Luxury box with ribbon', price: 800, Icon: Gift },
  { id: 'hamper', name: 'Hamper Basket', desc: 'Wicker basket arrangement', price: 1500, Icon: ShoppingBag },
] as const

const relationships = ['Mother', 'Father', 'Wife', 'Husband', 'Sister', 'Brother', 'Son', 'Daughter', 'Friend', 'Colleague', 'Other']

export default function SendToPakistanPage() {
  const router = useRouter()
  const [products, setProducts] = useState<DiasporaProduct[]>([])
  const [categoriesTabs, setCategoriesTabs] = useState<Array<{ slug: string; name: string }>>([])
  const [usedFallback, setUsedFallback] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [relOpen, setRelOpen] = useState(false)
  const [focus, setFocus] = useState({ name: false, phone: false, instructions: false })
  const [showCelebration, setShowCelebration] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'wise'>('stripe')
  const [paymentSettings, setPaymentSettings] = useState<{
    managePaymentsInAdmin: boolean
    stripeEnabled: boolean
    paypalEnabled: boolean
    wiseEmail: string
  } | null>(null)

  const {
    step, direction, category, selectedProduct, selectedProducts, selectedPacking, recipient, giftNote, buyerCurrency, exchangeRate,
    setCategory, setProduct, toggleProduct, setPacking, updateRecipient, updateGiftNote, nextStep, prevStep, setStep,
    getLiveTotal, getForeignTotal, fetchExchangeRate, detectBuyerCurrency, reset,
  } = useDiasporaStore()

  useEffect(() => {
    detectBuyerCurrency()
  }, [detectBuyerCurrency])
  useEffect(() => {
    fetchExchangeRate()
  }, [fetchExchangeRate, buyerCurrency])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [prodData, cats] = await Promise.all([fetchDiasporaProducts(activeTab), fetchDiasporaCategories()])
      setProducts(prodData.products)
      setUsedFallback(prodData.usedFallback)
      setCategoriesTabs(cats.map((c: { slug: string; name: string }) => ({ slug: c.slug, name: c.name })))
      setLoading(false)
    }
    load()
  }, [activeTab])

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        const s = Array.isArray(rows) ? rows[0] : null
        const dp = s?.domainPayments
        if (!dp) return
        setPaymentSettings({
          managePaymentsInAdmin: Boolean(dp.managePaymentsInAdmin ?? false),
          stripeEnabled: Boolean(dp.stripeEnabled ?? false),
          paypalEnabled: Boolean(dp.paypalEnabled ?? false),
          wiseEmail: String(dp.wiseEmail ?? ''),
        })
      })
      .catch(() => undefined)
  }, [])

  const availablePaymentMethods = useMemo(() => {
    const dp = paymentSettings
    if (!dp) return []
    if (!dp.managePaymentsInAdmin) return []
    const methods: Array<{ id: 'stripe' | 'paypal' | 'wise'; title: string; sub: string; Icon: typeof CreditCard }> = []
    if (dp.stripeEnabled) methods.push({ id: 'stripe', title: 'Credit / Debit Card', sub: 'Visa · Mastercard · Amex', Icon: CreditCard })
    if (dp.paypalEnabled) methods.push({ id: 'paypal', title: 'PayPal', sub: 'Pay with your PayPal balance', Icon: Wallet })
    if (dp.wiseEmail) methods.push({ id: 'wise', title: 'Wise / Bank Transfer', sub: 'International transfer (remittance)', Icon: Banknote })
    return methods
  }, [paymentSettings])

  useEffect(() => {
    if (availablePaymentMethods.length === 0) return
    const hasSelected = availablePaymentMethods.some((m) => m.id === paymentMethod)
    if (!hasSelected) setPaymentMethod(availablePaymentMethods[0]!.id)
  }, [availablePaymentMethods, paymentMethod])

  const symbol = buyerCurrency === 'USD' ? '$' : buyerCurrency === 'EUR' ? '€' : buyerCurrency === 'AED' ? 'AED ' : buyerCurrency === 'AUD' ? 'A$' : buyerCurrency === 'CAD' ? 'C$' : '£'
  const total = getLiveTotal()
  const foreignTotal = getForeignTotal()
  const totalSpring = useSpring(total, { stiffness: 300, damping: 30 })
  const totalDisplay = useTransform(totalSpring, (v) => `Rs ${Math.round(v).toLocaleString('en-PK')}`)
  useEffect(() => totalSpring.set(total), [total, totalSpring])

  const handleCategory = (id: string) => {
    if (id === 'custom') return router.push('/giftlab')
    setCategory(id)
    setActiveTab(id)
    nextStep()
  }

  const handleAddToCart = () => {
    const state = useDiasporaStore.getState()
    useCartStore.getState().addItem({
      id: `diaspora-${Date.now()}`,
      name: `Gift to Pakistan — ${state.recipient.name} (${state.recipient.city || state.recipient.otherCity})`,
      price: state.getLiveTotal(),
      quantity: 1,
      type: 'diaspora' as const,
      diasporaData: {
        products: state.selectedProducts,
        packing: state.selectedPacking,
        recipient: state.recipient,
        giftNote: state.giftNote,
        buyerCurrency: state.buyerCurrency,
        foreignTotal: state.getForeignTotal(),
      },
    })
    setShowCelebration(true)
    triggerConfetti()
  }

  const handleProceedToCheckout = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#0f0608] px-4 py-8 text-[#fdf4e8] md:px-8">
      <ProgressBar step={step} />
      <AnimatePresence custom={direction} mode="wait">
        <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="mx-auto max-w-7xl">
          {step === 1 && (
            <section>
              <div className="grid items-center gap-6 border border-[#c9a84c]/20 p-6 lg:grid-cols-2" style={{ background: 'radial-gradient(ellipse at 20% 50%, #3d0f1e 0%, #0f0608 65%)' }}>
                <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
                  {['FOR PAKISTANIS WORLDWIDE', 'Send your love', 'Anywhere in the world'].map((k, i) => (
                    <motion.div key={k} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }} className={i === 0 ? 'mb-4' : ''}>
                      {i === 0 ? <div className="flex items-center gap-3"><span className="h-px w-10 bg-[#c9a84c]/40" /><p className="font-cinzel text-[10px] tracking-[0.5em] text-[#c9a84c]">{k}</p><span className="h-px w-10 bg-[#c9a84c]/40" /></div> : null}
                      {i === 1 ? <h1 className="mt-4 font-lufga text-5xl font-light leading-[1.05] md:text-[64px]">Send your <em className="text-[#c9a84c] italic">love</em><br /> <em className="text-[#c9a84c] italic">home</em> to Pakistan</h1> : null}
                      {i === 2 ? <p className="mt-5 max-w-xl font-lufga text-lg font-light leading-[1.8] text-[#8a7060]">Anywhere in the world — we deliver to your family in Pakistan. Same day in major cities.</p> : null}
                    </motion.div>
                  ))}
                  <div className="mt-8 flex gap-6">{['UK', 'USA', 'Canada', 'UAE', 'Australia', 'Europe'].map((c) => <span key={c} className="inline-flex items-center gap-1 text-xs"><Globe size={12} className="text-[#c9a84c]" />{c}</span>)}</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <GlobeHero />
                </motion.div>
              </div>
              <h2 className="mt-20 text-center font-lufga text-4xl font-light">What would you like to send?</h2>
              <div className="mx-auto mt-8 grid max-w-[960px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat, i) => (
                  <motion.button key={cat.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} onClick={() => handleCategory(cat.id)} className="min-h-[160px] border border-[#c9a84c]/20 bg-[#1a0c10] p-8 text-left transition hover:border-[#c9a84c]/45 hover:bg-[#c9a84c]/[0.04]">
                    <cat.icon size={32} style={{ color: cat.accent }} />
                    <p className="mt-4 font-lufga text-[22px] font-bold">{cat.name}</p>
                    <p className="mt-2 text-[13px] text-[#8a7060]">{cat.desc}</p>
                    <span className="mt-4 inline-block border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 font-cinzel text-[9px] tracking-[0.2em] text-[#c9a84c]">Ships same day to Pakistan</span>
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="lg:flex lg:gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {[{ slug: category, name: categories.find((c) => c.id === category)?.name ?? 'Selected' }, ...categoriesTabs.filter((c) => c.slug !== category)].map((tab) => (
                    <button key={tab.slug} onClick={() => setActiveTab(tab.slug)} className={`border px-3 py-1 text-xs ${activeTab === tab.slug ? 'bg-[#c9a84c] text-[#0f0608] border-[#c9a84c]' : 'border-[#c9a84c]/30'}`}>{tab.name}</button>
                  ))}
                </div>
                {usedFallback && (
                  <div className="mt-3 border-l-2 border-[#c9a84c] bg-[#c9a84c]/10 px-4 py-3 font-cinzel text-[10px] tracking-[0.15em] text-[#c9a84c]">
                    No {categories.find((c) => c.id === activeTab)?.name ?? activeTab} products found — showing all available gifts instead
                  </div>
                )}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse border border-[#c9a84c]/20 bg-[#1a0c10] p-4"><div className="aspect-[4/3] bg-[#2a1117]" /><div className="mt-3 h-4 bg-[#2a1117]" /></div>)}
                  {!loading && products.map((product) => {
                    const selected = selectedProducts.some((p) => p.id === product.id)
                    return (
                      <article key={product.id} className={`relative border p-4 ${selected ? 'border-[#c9a84c] bg-[#c9a84c]/[0.04]' : 'border-[#c9a84c]/20 bg-[#1a0c10]'}`}>
                        {selected && <span className="absolute right-2 top-2 rounded-full bg-[#c9a84c] p-1 text-[#0f0608]"><Check size={14} /></span>}
                        <div className="group relative aspect-[4/3] overflow-hidden bg-[#12090b]">
                          {product.images?.[0]?.src ? <Image src={product.images[0].src} fill alt={product.name} className="object-cover" /> : <div className="grid h-full place-items-center"><Gift size={40} className="text-[#c9a84c]" /></div>}
                          <div className="absolute inset-0 bg-[#c9a84c]/10 opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <p className="mt-3 line-clamp-2 font-lufga text-base font-semibold">{product.name}</p>
                        <p className="line-clamp-1 text-xs text-[#8a7060]" dangerouslySetInnerHTML={{ __html: product.short_description || 'Premium gifting product' }} />
                        <p className="mt-2 text-xl font-bold text-[#c9a84c]">Rs {Number(product.price || 0).toLocaleString('en-PK')}</p>
                        <p className="text-sm text-[#8a7060]">{symbol}{(Number(product.price || 0) / exchangeRate).toFixed(2)}</p>
                        <button onClick={() => toggleProduct(product)} className={`mt-3 w-full border py-2 text-[11px] tracking-[0.15em] ${selected ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0f0608]' : 'border-[#c9a84c]/30 hover:bg-[#c9a84c]/10'}`}>{selected ? 'SELECTED ✓' : 'SELECT GIFT'}</button>
                      </article>
                    )
                  })}
                  {!loading && products.length === 0 && (
                    <div className="col-span-full grid place-items-center border border-[#c9a84c]/20 p-10 text-center">
                      <PackageX size={48} className="text-[#8a7060]" />
                      <p className="mt-3 text-2xl text-[#8a7060]">No products found</p>
                      <p className="text-sm text-[#8a7060]">Try a different category</p>
                      <button onClick={() => setActiveTab('all')} className="mt-4 border border-[#c9a84c]/30 px-4 py-2 text-xs">View all products</button>
                    </div>
                  )}
                </div>
              </div>
              <aside className="sticky top-6 mt-6 h-fit w-full border border-[#c9a84c]/20 bg-[#1a0c10] p-4 lg:mt-0 lg:w-[320px]">
                {selectedProducts.length === 0 ? (
                  <div className="grid min-h-[200px] place-items-center text-center"><Gift size={40} className="text-[#fdf4e8]/20" /><p className="text-sm text-[#fdf4e8]/30">Select a product to see pricing</p></div>
                ) : (
                  <>
                    <p className="font-cinzel text-[11px] tracking-[0.3em] text-[#c9a84c]">YOUR GIFT SUMMARY</p>
                    <div className="mt-3 space-y-2">
                      {selectedProducts.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex gap-3">
                          <div className="relative h-12 w-12 overflow-hidden">{p.images?.[0]?.src ? <Image src={p.images[0].src} fill alt={p.name} className="object-cover" /> : null}</div>
                          <div><p className="line-clamp-1 text-sm">{p.name}</p><p className="text-[#c9a84c]">Rs {Number(p.price).toLocaleString('en-PK')}</p></div>
                        </div>
                      ))}
                      <p className="text-xs text-[#8a7060]">{selectedProducts.length} products selected</p>
                    </div>
                    <div className="mt-4 text-xs text-[#8a7060]">You will pay</div>
                    <div className="text-3xl">{symbol}{foreignTotal.toFixed(2)} {buyerCurrency}</div>
                    <div className="text-[10px] text-[#8a7060]">Rate: 1 {buyerCurrency} = Rs {Math.round(exchangeRate)}</div>
                    <div className="mt-4 space-y-1 text-sm"><div className="flex justify-between"><span>Products</span><span>Rs {selectedProducts.reduce((s,p)=>s+Number(p.price||0),0).toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>Packing</span><span>Rs {selectedPacking.price.toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>Delivery</span><span>Rs 299</span></div></div>
                    <div className="my-3 border-t border-[#c9a84c]/20" />
                    <div className="flex justify-between"><span>Total PKR</span><motion.span className="text-xl font-bold text-[#c9a84c]">{totalDisplay}</motion.span></div>
                    <button disabled={selectedProducts.length===0} onClick={nextStep} className="mt-4 w-full bg-[#c9a84c] py-2 text-xs font-semibold tracking-[0.2em] text-[#0f0608] disabled:cursor-not-allowed disabled:opacity-40">CONTINUE →</button>
                  </>
                )}
              </aside>
            </section>
          )}

          {step === 3 && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(201,168,76,0.5)', marginBottom: '6px' }}>STEP 3 OF 5</p>
                  <h2 style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: '40px', lineHeight: 1.1 }}>Who receives <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>the gift?</em></h2>
                  <p style={{ color: '#8a7060', marginTop: 8 }}>Their details stay private and are only used for delivery.</p>
                </div>
                <div className="mb-10">
                  <p className="mb-3 font-cinzel text-[11px] tracking-[0.3em] text-[#c9a84c]">ADD PACKING & EXTRAS</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {packingOptions.map((pack) => {
                      const active = selectedPacking.id === pack.id
                      return (
                        <button key={pack.id} onClick={() => setPacking(pack)} className={`relative border p-4 text-left ${active ? 'border-[#c9a84c]' : 'border-[#c9a84c]/20'}`}>
                          {active && <Check className="absolute right-3 top-3 text-[#c9a84c]" size={14} />}
                          <pack.Icon size={20} className="text-[#c9a84c]" />
                          <p className="mt-2 text-base font-semibold">{pack.name}</p>
                          <p className="text-xs text-[#8a7060]">{pack.desc}</p>
                          <p className="mt-1 text-sm text-[#c9a84c]">{pack.price === 0 ? 'Free' : `Rs ${pack.price.toLocaleString('en-PK')}`}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <FormField label="Recipient's Full Name" focused={focus.name}><input value={recipient.name} onFocus={() => setFocus((s) => ({ ...s, name: true }))} onBlur={() => setFocus((s) => ({ ...s, name: false }))} onChange={(e) => updateRecipient({ name: e.target.value })} placeholder="e.g. Ayesha Khan" style={inputStyle} /></FormField>
                <div style={{ marginBottom: 40 }}>
                  <label style={labelStyle}>Phone Number in Pakistan</label>
                  <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: `1px solid ${focus.phone ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`, position: 'relative' }}>
                    <span style={{ fontFamily: 'Lufga', fontWeight: 700, fontSize: 18, color: '#c9a84c', paddingBottom: 16, paddingRight: 16, borderRight: '1px solid rgba(201,168,76,0.2)', marginRight: 16 }}>+92</span>
                    <input onFocus={() => setFocus((s) => ({ ...s, phone: true }))} onBlur={() => setFocus((s) => ({ ...s, phone: false }))} value={recipient.phone} onChange={(e) => updateRecipient({ phone: e.target.value })} placeholder="300 1234567" style={{ ...inputStyle, border: 'none', padding: '16px 0', flex: 1 }} />
                    <motion.div animate={{ width: focus.phone ? '100%' : '0%' }} style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#c9a84c' }} />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(253,244,232,0.3)', marginTop: 8, fontStyle: 'italic' }}>We&apos;ll send delivery updates to this number</p>
                </div>
                <div style={{ marginBottom: 40, position: 'relative' }}>
                  <label style={labelStyle}>Your Relationship</label>
                  <motion.div onClick={() => setRelOpen((v) => !v)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px solid ${relOpen ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`, padding: '16px 0', cursor: 'pointer' }}>
                    <span style={{ fontSize: 18, color: recipient.relation ? '#fdf4e8' : 'rgba(253,244,232,0.2)', fontStyle: recipient.relation ? 'normal' : 'italic' }}>{recipient.relation || 'Select relationship...'}</span>
                    <motion.div animate={{ rotate: relOpen ? 180 : 0 }}><ChevronDown size={18} color="rgba(201,168,76,0.6)" /></motion.div>
                  </motion.div>
                  <AnimatePresence>
                    {relOpen && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a0c10', border: '1px solid rgba(201,168,76,0.25)', borderTop: 'none', zIndex: 50, maxHeight: 280, overflowY: 'auto' }}>
                        {relationships.map((rel, i) => (
                          <motion.div key={rel} onClick={() => { updateRecipient({ relation: rel }); setRelOpen(false) }} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ background: 'rgba(201,168,76,0.08)', x: 4 }} style={{ padding: '14px 20px', fontSize: 16, color: recipient.relation === rel ? '#c9a84c' : '#fdf4e8', cursor: 'pointer', borderBottom: '1px solid rgba(201,168,76,0.06)', display: 'flex', justifyContent: 'space-between' }}>{rel}{recipient.relation === rel && <Check size={14} color="#c9a84c" />}</motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div style={{ marginBottom: 40, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><label style={labelStyle}>Special Instructions</label><span style={{ fontSize: 11, color: 'rgba(253,244,232,0.25)', fontStyle: 'italic' }}>Optional</span></div>
                  <textarea rows={4} maxLength={300} value={recipient.specialInstructions} onFocus={() => setFocus((s) => ({ ...s, instructions: true }))} onBlur={() => setFocus((s) => ({ ...s, instructions: false }))} onChange={(e) => updateRecipient({ specialInstructions: e.target.value })} placeholder="e.g. Please call before delivery, ring doorbell twice..." style={{ ...inputStyle, minHeight: 120, resize: 'none', lineHeight: 1.8, paddingBottom: 40 }} />
                  <span style={{ position: 'absolute', right: 0, bottom: 12, fontSize: 11, color: recipient.specialInstructions.length > 270 ? '#c4687a' : 'rgba(253,244,232,0.2)' }}>{recipient.specialInstructions.length}/300</span>
                  <motion.div animate={{ width: focus.instructions ? '100%' : '0%' }} style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#c9a84c' }} />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(201,168,76,0.5)', marginBottom: '6px' }}>DELIVERY</p>
                  <h2 style={{ fontFamily: 'Lufga', fontWeight: 300, fontSize: 40, lineHeight: 1.1 }}>Where in <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Pakistan?</em></h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((c) => <button key={c.name} onClick={() => updateRecipient({ city: c.name })} className={`border p-4 text-center ${recipient.city === c.name ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-[#c9a84c]/20'}`}><p className="font-semibold">{c.name}</p><span className={`mt-1 inline-block border px-2 py-0.5 text-[10px] ${c.same ? 'border-[#5aaa7a]/30 bg-[#5aaa7a]/10 text-[#5aaa7a]' : 'border-[#c9a84c]/20 bg-[#c9a84c]/10 text-[#c9a84c]'}`}>{c.same ? 'Same-day' : 'Next-day'}</span></button>)}
                  <button onClick={() => updateRecipient({ city: 'Other City' })} className={`col-span-2 border p-4 ${recipient.city === 'Other City' ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-[#c9a84c]/20'}`}>Other City</button>
                </div>
                {recipient.city === 'Other City' && <input value={recipient.otherCity} onChange={(e) => updateRecipient({ otherCity: e.target.value })} placeholder="Enter city name" style={{ ...inputStyle, marginTop: 12 }} />}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(['today', 'tomorrow', 'scheduled'] as const).map((slot) => <button key={slot} onClick={() => updateRecipient({ deliverySlot: slot })} className={`border py-2 text-xs ${recipient.deliverySlot === slot ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0f0608]' : 'border-[#c9a84c]/20'}`}>{slot === 'scheduled' ? 'Schedule Date' : slot[0].toUpperCase() + slot.slice(1)}</button>)}
                </div>
                {recipient.deliverySlot !== 'scheduled' && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(['morning', 'afternoon', 'evening'] as const).map((slot) => <button key={slot} onClick={() => updateRecipient({ timeSlot: slot })} className={`border py-2 text-xs ${recipient.timeSlot === slot ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-[#c9a84c]/20'}`}>{slot === 'morning' ? 'Morning (9am–1pm)' : slot === 'afternoon' ? 'Afternoon (1pm–5pm)' : 'Evening (5pm–9pm)'}</button>)}
                  </div>
                )}
                {recipient.deliverySlot === 'scheduled' && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                    <LuxuryDatePicker selected={recipient.deliveryDate} onSelect={(date) => updateRecipient({ deliveryDate: date })} minDate={new Date()} />
                  </motion.div>
                )}
              </motion.div>
              <div className="block h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent md:hidden" />
            </section>
          )}

          {step === 4 && (
            <section className="mx-auto max-w-[700px] text-center">
              <h2 className="text-5xl font-light">Write your gift message</h2>
              <p className="mt-3 text-[#8a7060]">Your words will be beautifully printed on a card</p>
              <div className="mx-auto mt-6 h-[340px] w-full max-w-[520px]">
                <AnimatePresence mode="wait">
                  <motion.div key={giftNote.cardDesign} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                    <GiftCardSVG design={giftNote.cardDesign} message={giftNote.message} senderName={giftNote.senderName} recipientName={recipient.name} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-4 flex justify-center gap-3">{(['classic', 'floral', 'minimal'] as const).map((d) => <button key={d} onClick={() => updateGiftNote({ cardDesign: d })} className={`h-[52px] w-[80px] border ${giftNote.cardDesign === d ? 'border-2 border-[#c9a84c]' : 'border-[#c9a84c]/20'}`} />)}</div>
              <textarea value={giftNote.message} onChange={(e) => updateGiftNote({ message: e.target.value.slice(0, 250) })} placeholder="Write something meaningful..." className="mt-5 w-full border border-[#c9a84c]/20 bg-[#1a0c10] p-4 italic" />
              <div className="text-right text-xs text-[#8a7060]">{giftNote.message.length}/250</div>
              <input value={giftNote.senderName} onChange={(e) => updateGiftNote({ senderName: e.target.value })} placeholder="Your name" className="mt-2 w-full border border-[#c9a84c]/20 bg-[#1a0c10] p-3" />
              <button onClick={() => updateGiftNote({ waNotify: !giftNote.waNotify })} className="mt-3 flex w-full items-center justify-between border border-[#c9a84c]/20 p-3 text-left"><span className="inline-flex items-center gap-2"><MessageCircle className="text-[#25D366]" size={20} />Notify {recipient.name || 'recipient'} via WhatsApp when gift is out for delivery</span><span className={`h-6 w-11 rounded-full ${giftNote.waNotify ? 'bg-[#25D366]' : 'bg-[#c9a84c]/20'} p-1`}><span className={`block h-4 w-4 rounded-full bg-white transition ${giftNote.waNotify ? 'translate-x-5' : 'translate-x-0'}`} /></span></button>
              {giftNote.waNotify && <input value={giftNote.waPhone || recipient.phone} onChange={(e) => updateGiftNote({ waPhone: e.target.value })} placeholder="WhatsApp number" className="mt-2 w-full border border-[#c9a84c]/20 bg-[#1a0c10] p-3" />}
              <label className="mt-3 block h-[120px] cursor-pointer border border-dashed border-[#c9a84c]/25 p-4"><Upload className="mx-auto text-[#8a7060]" /><p className="mt-2 text-sm text-[#8a7060]">Add a personal photo (optional)</p><input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; updateGiftNote({ photoName: f.name, photoUrl: URL.createObjectURL(f) }) }} />{giftNote.photoName && <p className="mt-2 text-xs">{giftNote.photoName}</p>}</label>
            </section>
          )}

          {step === 5 && (
            <section className="lg:flex lg:gap-8">
              <div className="flex-1 space-y-8">
                <div><p className="mb-2 border-b border-[#c9a84c]/20 pb-2 text-lg">Your Gift</p><div className="space-y-2">{selectedProducts.map((p)=><div key={p.id} className="flex items-center gap-3"><div className="relative h-14 w-14 overflow-hidden">{p.images?.[0]?.src ? <Image src={p.images[0].src} fill alt={p.name} className="object-cover" /> : null}</div><div><p>{p.name}</p><p className="text-[#c9a84c]">Rs {Number(p.price || 0).toLocaleString('en-PK')}</p></div></div>)}</div><p className="mt-2 text-[#8a7060]">{selectedPacking.name} · Rs {selectedPacking.price.toLocaleString('en-PK')}</p></div>
                <div><p className="mb-2 border-b border-[#c9a84c]/20 pb-2 text-lg">Delivery Details</p><p className="text-xl">{recipient.name}</p><p className="italic text-[#8a7060]">{recipient.relation}</p><p className="mt-2 inline-flex items-center gap-2"><MapPin size={14} />{recipient.city || recipient.otherCity} · {recipient.deliverySlot}</p><p className="inline-flex items-center gap-2"><Phone size={14} />+92 {recipient.phone}</p></div>
                <div><p className="mb-2 border-b border-[#c9a84c]/20 pb-2 text-lg">Your Gift Message</p><div style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}><GiftCardSVG design={giftNote.cardDesign} message={giftNote.message} senderName={giftNote.senderName} recipientName={recipient.name} /></div><p className="mt-2 text-xs italic text-[#8a7060]">This will be beautifully printed and placed in your gift</p></div>
                <div className="space-y-1"><div className="flex justify-between"><span>Products ({selectedProducts.length})</span><span>Rs {selectedProducts.reduce((s,p)=>s+Number(p.price||0),0).toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>Packing</span><span>Rs {selectedPacking.price.toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>Delivery</span><span>Rs 299</span></div><div className="my-2 border-t border-[#c9a84c]/20" /><div className="flex justify-between font-semibold"><span>Total (PKR)</span><span>Rs {total.toLocaleString('en-PK')}</span></div><div className="flex justify-between"><span>You pay</span><span>{symbol}{foreignTotal.toFixed(2)} {buyerCurrency}</span></div><p className="text-xs text-[#8a7060]">Rate: 1 {buyerCurrency} = Rs {Math.round(exchangeRate)} · Updated live</p></div>
              </div>
              <aside className="sticky top-6 mt-8 h-fit w-full border border-[#c9a84c]/20 bg-[#1a0c10] p-5 lg:mt-0 lg:w-[360px]">
                <p className="font-cinzel text-[11px] tracking-[0.3em] text-[#c9a84c]">COMPLETE YOUR ORDER</p>
                <p className="mt-3 text-4xl font-bold text-[#c9a84c]">Rs {total.toLocaleString('en-PK')}</p>
                <p className="text-[#8a7060]">{symbol}{foreignTotal.toFixed(2)}</p>
                {paymentSettings?.managePaymentsInAdmin && availablePaymentMethods.length > 0 ? (
                  <>
                    <div className="mt-4 space-y-2">
                      {availablePaymentMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`w-full border p-3 text-left ${paymentMethod === m.id ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-[#c9a84c]/20'}`}
                        >
                          <p className="inline-flex items-center gap-2"><m.Icon size={18} />{m.title}</p>
                          <p className="text-xs text-[#8a7060]">{m.sub}</p>
                        </button>
                      ))}
                    </div>
                    <button onClick={handleProceedToCheckout} className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-[#c9a84c] text-xs font-semibold tracking-[0.25em] text-[#0f0608]">
                      <Lock size={14} />PROCEED TO CHECKOUT
                    </button>
                    <p className="mt-2 text-center text-[11px] text-[#8a7060]">
                      Payment will be completed securely at checkout.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mt-4 border border-[#c9a84c]/20 bg-[#c9a84c]/[0.04] p-3 text-xs text-[#8a7060]">
                      Payments are handled by your WooCommerce gateways at checkout.
                    </div>
                    <button onClick={handleProceedToCheckout} className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-[#c9a84c] text-xs font-semibold tracking-[0.25em] text-[#0f0608]">
                      <Lock size={14} />ADD TO CART & CHECKOUT
                    </button>
                  </>
                )}
              </aside>
            </section>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && <button onClick={prevStep} className="border border-[#c9a84c]/30 px-5 py-2">Back</button>}
            {step > 2 && step < 5 && <button onClick={nextStep} className="bg-[#c9a84c] px-5 py-2 text-[#0f0608]">Next</button>}
          </div>
        </motion.div>
      </AnimatePresence>

      <CelebrateOverlay
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        recipient={recipient}
        giftNote={giftNote}
        total={total}
        deliverySlot={recipient.deliverySlot}
      />
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  const labels = ['Category', 'Product', 'Recipient', 'Personalize', 'Review']
  return <div className="mx-auto mb-8 flex max-w-5xl justify-between">{labels.map((label, i) => <div key={label} className="text-center"><div className={`mx-auto mb-2 h-4 w-4 rounded-full border border-[#c9a84c] ${i + 1 <= step ? 'bg-[#c9a84c]' : ''}`} /><p className="text-[11px] text-[#8a7060]">{label}</p></div>)}</div>
}

const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: 10 }
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(253,244,232,0.03)', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.2)', color: '#fdf4e8', fontFamily: 'Lufga, sans-serif', fontWeight: 300, fontSize: 18, padding: '16px 0', outline: 'none', caretColor: '#c9a84c' }

function FormField({ label, focused, children }: { label: string; focused: boolean; children: React.ReactNode }) {
  return <div style={{ marginBottom: 32, position: 'relative' }}><label style={labelStyle}>{label}</label>{children}<motion.div animate={{ width: focused ? '100%' : '0%' }} transition={{ duration: 0.3 }} style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#c9a84c' }} /></div>
}

function GlobeHero() {
  return (
    <svg viewBox="0 0 300 300" width="300" className="mx-auto">
      <circle cx="150" cy="150" r="130" fill="none" stroke="#c9a84c" opacity="0.2" strokeWidth="1" />
      {Array.from({ length: 6 }).map((_, i) => <line key={`lat-${i}`} x1="30" x2="270" y1={80 + i * 24} y2={80 + i * 24} stroke="#c9a84c" opacity="0.08" />)}
      {Array.from({ length: 6 }).map((_, i) => <ellipse key={`lon-${i}`} cx="150" cy="150" rx={30 + i * 18} ry="130" fill="none" stroke="#c9a84c" opacity="0.08" />)}
      {[[130, 80], [60, 100], [70, 70], [190, 130], [230, 200]].map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="3" fill="#c9a84c" opacity="0.5" /><line x1={x} y1={y} x2="185" y2="110" stroke="#c9a84c" opacity="0.2" strokeDasharray="3 4" /></g>)}
      <motion.circle cx="185" cy="110" r="6" fill="#c9a84c" style={{ filter: 'drop-shadow(0 0 8px #c9a84c)' }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="195" y="114" fill="#fdf4e8" fontSize="10">Pakistan</text>
      <motion.circle cx="150" cy="150" r="145" fill="none" stroke="#c9a84c" opacity="0.05" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: 'center' }} />
    </svg>
  )
}

function GiftCardSVG({ design, message, senderName, recipientName }: { design: 'classic' | 'floral' | 'minimal'; message: string; senderName: string; recipientName: string }) {
  const style = design === 'classic' ? { background: '#fdf4e8', border: '1px solid rgba(201,168,76,0.6)', color: '#2a1a14' } : design === 'floral' ? { background: '#fff8f9', border: '1px solid rgba(196,104,122,0.4)', color: '#2a1a14' } : { background: '#1a0c10', border: '1px solid rgba(201,168,76,0.3)', color: '#fdf4e8' }
  return <div style={{ ...style, width: 520, maxWidth: '100%', height: 340, padding: 28, margin: '0 auto', textAlign: 'left' }}><p style={{ fontStyle: 'italic', color: '#8a7060' }}>To: {recipientName || 'Recipient'}</p><p style={{ marginTop: 24, fontFamily: 'Lufga', fontStyle: 'italic', fontSize: 18, lineHeight: 1.8 }}>{message || 'Write something meaningful...'}</p><p style={{ marginTop: 24, fontStyle: 'italic' }}>From: {senderName || 'Your name'}</p></div>
}

function triggerConfetti() {
  const colors = ['#c9a84c', '#fdf4e8', '#e8c96a', '#c4687a']
  const end = Date.now() + 4000
  const frame = () => {
    confetti({ particleCount: 8, angle: 60, spread: 60, origin: { x: 0 }, colors, gravity: 1.1 })
    confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 }, colors, gravity: 1.1 })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function CelebrateOverlay({ open, onClose, recipient, giftNote, total, deliverySlot }: { open: boolean; onClose: () => void; recipient: { city: string; otherCity: string; name: string; phone: string }; giftNote: { cardDesign: 'classic' | 'floral' | 'minimal'; message: string; senderName: string; waNotify: boolean; waPhone: string }; total: number; deliverySlot: string }) {
  const router = useRouter()
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,6,8,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, overflowY: 'auto' }}>
          <motion.svg width="90" height="90" viewBox="0 0 90 90" style={{ marginBottom: 32 }}>
            <motion.circle cx="45" cy="45" r="40" stroke="#c9a84c" strokeWidth="1" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path d="M28 45 L40 57 L63 33" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }} />
          </motion.svg>
          <p style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.5em', color: '#c9a84c', marginBottom: 20 }}>GIFT CONFIRMED</p>
          <h2 style={{ fontWeight: 300, fontSize: 52, lineHeight: 1.1, marginBottom: 16 }}>Your love is on its<br />way to <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>{recipient.city || recipient.otherCity}</em></h2>
          <p style={{ color: '#8a7060', lineHeight: 1.8, marginBottom: 30 }}>{recipient.name} will receive your beautiful gift {deliverySlot === 'today' ? 'today' : 'tomorrow'}.</p>
          <div style={{ transform: 'rotate(-2deg)', marginBottom: 30 }}><div style={{ transform: 'scale(0.5)' }}><GiftCardSVG design={giftNote.cardDesign} message={giftNote.message} senderName={giftNote.senderName} recipientName={recipient.name} /></div></div>
          <div style={{ border: '1px solid rgba(201,168,76,0.25)', padding: '20px 40px', marginBottom: 30, display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}><div><p style={{ color: '#8a7060', fontSize: 10, letterSpacing: '0.2em' }}>ORDER TOTAL</p><p style={{ color: '#c9a84c', fontSize: 28, fontWeight: 700 }}>Rs {total.toLocaleString('en-PK')}</p></div><div><p style={{ color: '#8a7060', fontSize: 10, letterSpacing: '0.2em' }}>DELIVERS TO</p><p>{recipient.city || recipient.otherCity}</p></div><div><p style={{ color: '#8a7060', fontSize: 10, letterSpacing: '0.2em' }}>RECIPIENT</p><p>{recipient.name}</p></div></div>
          {giftNote.waNotify && <a href={`https://wa.me/${giftNote.waPhone || recipient.phone}?text=Your gift from ${giftNote.senderName} is on its way! 🎁`} target="_blank" className="mb-3 inline-flex items-center gap-2 bg-[#25D366] px-8 py-3 text-xs tracking-[0.1em] text-white"><MessageCircle size={18} />NOTIFY ON WHATSAPP</a>}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => router.push('/cart')} className="bg-[#c9a84c] px-10 py-3 text-xs tracking-[0.2em] text-[#0f0608]">VIEW CART</button>
            <button onClick={() => router.push('/shop')} className="border border-[#fdf4e8]/20 px-10 py-3 text-xs tracking-[0.2em]">CONTINUE SHOPPING</button>
            <button onClick={() => { onClose(); useDiasporaStore.getState().reset(); router.push('/send-to-pakistan') }} className="border border-[#8a7060]/20 px-10 py-3 text-xs tracking-[0.2em] text-[#8a7060]">SEND ANOTHER GIFT</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
