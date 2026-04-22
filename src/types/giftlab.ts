import type { Product, Occasion } from './product'

export type BoxSize = 'small' | 'medium' | 'large' | 'xl'
export type RibbonColor = 'red' | 'pink' | 'gold' | 'white' | 'black' | 'burgundy'
export type CardDesign = 'classic' | 'floral' | 'minimal'
export type DeliverySpeed = 'same-day' | 'next-day' | 'standard'

export interface BoxOption {
  id: BoxSize
  name: string
  basePrice: number
  maxItems: number
  dimensions: string
}

export const BOX_OPTIONS: BoxOption[] = [
  { id: 'small', name: 'Small Box', basePrice: 1200, maxItems: 4, dimensions: '20×20cm' },
  { id: 'medium', name: 'Medium Box', basePrice: 1800, maxItems: 8, dimensions: '30×30cm' },
  { id: 'large', name: 'Large Box', basePrice: 2500, maxItems: 12, dimensions: '40×40cm' },
  { id: 'xl', name: 'XL Hamper', basePrice: 3500, maxItems: 18, dimensions: '50×40cm' },
]

export async function fetchGiftLabBoxes(): Promise<BoxOption[]> {
  try {
    const res = await fetch('/api/admin/giftlab-boxes', { cache: 'no-store' })
    if (!res.ok) return BOX_OPTIONS
    const rows = await res.json()
    const parsed = rows.map((row: Record<string, unknown>) => ({
      id: String(row.size || row.id) as BoxOption['id'],
      name: String(row.name || ''),
      basePrice: Number(row.basePrice || 0),
      maxItems: Number(row.maxItems || 0),
      dimensions: String(row.dimensions || ''),
    }))
    return parsed.length ? parsed : BOX_OPTIONS
  } catch {
    return BOX_OPTIONS
  }
}

export interface AddOn {
  id: string
  name: string
  price: number
  lucideIcon: string
}

export const ADD_ONS: AddOn[] = [
  { id: 'card', name: 'Greeting Card', price: 500, lucideIcon: 'PackageOpen' },
  { id: 'wrapping', name: 'Premium Wrapping', price: 800, lucideIcon: 'Gift' },
  { id: 'candle', name: 'Candle', price: 300, lucideIcon: 'Flame' },
  { id: 'balloons', name: 'Balloon Bunch', price: 400, lucideIcon: 'Smile' },
]

export async function fetchGiftLabAddOns(): Promise<AddOn[]> {
  try {
    const res = await fetch('/api/admin/giftlab-addons', { cache: 'no-store' })
    if (!res.ok) return ADD_ONS
    const rows = await res.json()
    const parsed = rows.map((row: Record<string, unknown>) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      price: Number(row.price || 0),
      lucideIcon: String(row.lucideIcon || 'Gift'),
    }))
    return parsed.length ? parsed : ADD_ONS
  } catch {
    return ADD_ONS
  }
}

export interface GiftLabState {
  step: 1 | 2 | 3 | 4 | 5
  direction: 1 | -1
  occasion: Occasion | null
  box: BoxOption | null
  selectedItems: Product[]
  ribbon: RibbonColor
  message: string
  senderName: string
  cardDesign: CardDesign
  selectedAddOns: string[]
  delivery: DeliverySpeed
}
