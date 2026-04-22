export const CATEGORY_STYLES = {
  'gifts-hampers': { color: '#c4687a', glow: '#7a1a3a', lucideIcon: 'Gift' },
  'clothing': { color: '#c9a84c', glow: '#5c3a10', lucideIcon: 'Shirt' },
  'watches-accessories': { color: '#7ab8d4', glow: '#1a3a5c', lucideIcon: 'Watch' },
  'digital': { color: '#8a7060', glow: '#2a1a10', lucideIcon: 'Download' },
  'flowers-cakes': { color: '#a8d48a', glow: '#1a4a20', lucideIcon: 'Flower2' },
} as const

export const DELIVERY_OPTIONS = [
  { id: 'same-day', label: 'Same-day delivery', price: 299, desc: 'Arrives today' },
  { id: 'next-day', label: 'Next-day delivery', price: 199, desc: 'Arrives tomorrow' },
  { id: 'standard', label: 'Standard delivery', price: 0, desc: 'Arrives in 2–3 days' },
] as const
