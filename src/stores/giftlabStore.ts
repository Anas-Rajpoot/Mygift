'use client'

import { create } from 'zustand'
import { ADD_ONS, BOX_OPTIONS, type BoxOption, type DeliverySpeed, type RibbonColor } from '@/types/giftlab'
import { DELIVERY_OPTIONS } from '@/lib/categories'
import type { Occasion } from '@/types/product'

export interface GiftLabProduct {
  id: number
  name: string
  price: string
  images?: Array<{ src: string }>
  categories?: Array<{ id: number; name: string; slug: string }>
}

interface GiftLabState {
  step: 1 | 2 | 3 | 4 | 5
  occasion: Occasion | null
  box: BoxOption | null
  selectedItems: GiftLabProduct[]
  ribbon: RibbonColor
  message: string
  senderName: string
  selectedAddOns: string[]
  delivery: DeliverySpeed
  addOnCatalog: typeof ADD_ONS
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void
  setOccasion: (occasion: Occasion) => void
  setBox: (boxId: BoxOption['id']) => void
  setRibbon: (ribbon: RibbonColor) => void
  setMessage: (message: string) => void
  setSenderName: (senderName: string) => void
  setDelivery: (delivery: DeliverySpeed) => void
  setAddOnCatalog: (catalog: typeof ADD_ONS) => void
  toggleAddOn: (id: string) => void
  addItem: (item: GiftLabProduct) => void
  removeItem: (id: number) => void
  isItemSelected: (id: number) => boolean
  getItemsTotal: () => number
  getAddOnsTotal: () => number
  getDeliveryPrice: () => number
  getLiveTotal: () => number
  reset: () => void
}

const initialState = {
  step: 1 as const,
  occasion: null,
  box: null,
  selectedItems: [],
  ribbon: 'gold' as const,
  message: '',
  senderName: '',
  selectedAddOns: [],
  delivery: 'same-day' as const,
  addOnCatalog: ADD_ONS,
}

export const useGiftLabStore = create<GiftLabState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setOccasion: (occasion) => set({ occasion }),
  setBox: (boxId) => set({ box: BOX_OPTIONS.find((box) => box.id === boxId) ?? null }),
  setRibbon: (ribbon) => set({ ribbon }),
  setMessage: (message) => set({ message }),
  setSenderName: (senderName) => set({ senderName }),
  setDelivery: (delivery) => set({ delivery }),
  setAddOnCatalog: (catalog) => set({ addOnCatalog: catalog }),
  toggleAddOn: (id) =>
    set((state) => ({
      selectedAddOns: state.selectedAddOns.includes(id)
        ? state.selectedAddOns.filter((item) => item !== id)
        : [...state.selectedAddOns, id],
    })),
  addItem: (item) =>
    set((state) => {
      if (state.selectedItems.some((entry) => entry.id === item.id)) return state
      return { selectedItems: [...state.selectedItems, item] }
    }),
  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((item) => item.id !== id),
    })),
  isItemSelected: (id) => get().selectedItems.some((item) => item.id === id),
  getItemsTotal: () => get().selectedItems.reduce((sum, item) => sum + Number(item.price), 0),
  getAddOnsTotal: () =>
    get().selectedAddOns.reduce((sum, addonId) => {
      const addon = get().addOnCatalog.find((entry) => entry.id === addonId)
      return sum + (addon?.price ?? 0)
    }, 0),
  getDeliveryPrice: () => DELIVERY_OPTIONS.find((entry) => entry.id === get().delivery)?.price ?? 299,
  getLiveTotal: () => {
    const state = get()
    const boxPrice = state.box?.basePrice ?? 0
    const itemsTotal = state.selectedItems.reduce((sum, item) => sum + Number(item.price), 0)
    const addOnsTotal = state.selectedAddOns.reduce((sum, addonId) => {
      const addon = state.addOnCatalog.find((entry) => entry.id === addonId)
      return sum + (addon?.price ?? 0)
    }, 0)
    const deliveryPrice = DELIVERY_OPTIONS.find((entry) => entry.id === state.delivery)?.price ?? 299
    return boxPrice + itemsTotal + addOnsTotal + deliveryPrice
  },
  reset: () => set({ ...initialState }),
}))
