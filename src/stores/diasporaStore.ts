'use client'

import { create } from 'zustand'

type Step = 1 | 2 | 3 | 4 | 5
type PackingOption = { id: 'standard' | 'premium' | 'hamper'; name: string; price: number }
type CardDesign = 'classic' | 'floral' | 'minimal'

export interface DiasporaProduct {
  id: number
  name: string
  price: string
  short_description?: string
  images?: Array<{ src: string }>
  categories?: Array<{ id: number; name: string; slug: string }>
}

interface DiasporaState {
  step: Step
  direction: 1 | -1
  category: string
  selectedProduct: DiasporaProduct | null
  selectedProducts: DiasporaProduct[]
  selectedPacking: PackingOption
  recipient: {
    name: string
    phone: string
    relation: string
    city: string
    otherCity: string
    specialInstructions: string
    deliverySlot: 'today' | 'tomorrow' | 'scheduled'
    deliveryDate: Date | null
    timeSlot: 'morning' | 'afternoon' | 'evening'
  }
  giftNote: {
    cardDesign: CardDesign
    message: string
    senderName: string
    waNotify: boolean
    waPhone: string
    photoName: string
    photoUrl: string
  }
  buyerCurrency: string
  exchangeRate: number
  setCategory: (category: string) => void
  setProduct: (product: DiasporaProduct) => void
  toggleProduct: (product: DiasporaProduct) => void
  setPacking: (packing: PackingOption) => void
  updateRecipient: (partial: Partial<DiasporaState['recipient']>) => void
  updateGiftNote: (partial: Partial<DiasporaState['giftNote']>) => void
  setStep: (step: Step) => void
  nextStep: () => void
  prevStep: () => void
  getLiveTotal: () => number
  getForeignTotal: () => number
  fetchExchangeRate: () => Promise<void>
  detectBuyerCurrency: () => void
  reset: () => void
}

const defaultPacking: PackingOption = { id: 'standard', name: 'Standard Packing', price: 0 }

const initialRecipient: DiasporaState['recipient'] = {
  name: '',
  phone: '',
  relation: '',
  city: '',
  otherCity: '',
  specialInstructions: '',
  deliverySlot: 'today',
  deliveryDate: null,
  timeSlot: 'morning',
}

const initialGiftNote: DiasporaState['giftNote'] = {
  cardDesign: 'classic',
  message: '',
  senderName: '',
  waNotify: false,
  waPhone: '',
  photoName: '',
  photoUrl: '',
}

export const useDiasporaStore = create<DiasporaState>((set, get) => ({
  step: 1,
  direction: 1,
  category: 'all',
  selectedProduct: null,
  selectedProducts: [],
  selectedPacking: defaultPacking,
  recipient: initialRecipient,
  giftNote: initialGiftNote,
  buyerCurrency: 'GBP',
  exchangeRate: 345,
  setCategory: (category) => set({ category }),
  setProduct: (selectedProduct) => set((s) => ({
    selectedProduct,
    selectedProducts: s.selectedProducts.some((p) => p.id === selectedProduct.id) ? s.selectedProducts : [...s.selectedProducts, selectedProduct],
  })),
  toggleProduct: (product) =>
    set((s) => {
      const exists = s.selectedProducts.some((p) => p.id === product.id)
      const selectedProducts = exists ? s.selectedProducts.filter((p) => p.id !== product.id) : [...s.selectedProducts, product]
      return {
        selectedProducts,
        selectedProduct: selectedProducts[0] ?? null,
      }
    }),
  setPacking: (selectedPacking) => set({ selectedPacking }),
  updateRecipient: (partial) => set((s) => ({ recipient: { ...s.recipient, ...partial } })),
  updateGiftNote: (partial) => set((s) => ({ giftNote: { ...s.giftNote, ...partial } })),
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(5, s.step + 1) as Step, direction: 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) as Step, direction: -1 })),
  getLiveTotal: () => {
    const s = get()
    const productPrice = s.selectedProducts.reduce((sum, p) => sum + Number(p.price ?? 0), 0)
    const packingPrice = s.selectedPacking?.price ?? 0
    const deliveryPrice = 299
    return productPrice + packingPrice + deliveryPrice
  },
  getForeignTotal: () => {
    const s = get()
    if (!s.exchangeRate) return 0
    return s.getLiveTotal() / s.exchangeRate
  },
  fetchExchangeRate: async () => {
    try {
      const currency = get().buyerCurrency || 'GBP'
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/PKR')
      const data = await res.json()
      const rate = 1 / (data.rates[currency] ?? (1 / 345))
      set({ exchangeRate: rate })
    } catch {
      set({ exchangeRate: 345 })
    }
  },
  detectBuyerCurrency: () => {
    try {
      const locale = Intl.NumberFormat().resolvedOptions().locale
      const currencyMap: Record<string, string> = {
        'en-GB': 'GBP', 'en-US': 'USD', 'en-CA': 'CAD', 'en-AU': 'AUD', 'ar-AE': 'AED',
      }
      const currency = currencyMap[locale] || (locale.startsWith('de') || locale.startsWith('fr') || locale.startsWith('it') || locale.startsWith('es') ? 'EUR' : 'GBP')
      set({ buyerCurrency: currency })
    } catch {
      set({ buyerCurrency: 'GBP' })
    }
  },
  reset: () => set({
    step: 1,
    direction: 1,
    category: 'all',
    selectedProduct: null,
    selectedProducts: [],
    selectedPacking: defaultPacking,
    recipient: initialRecipient,
    giftNote: initialGiftNote,
    buyerCurrency: 'GBP',
    exchangeRate: 345,
  }),
}))
