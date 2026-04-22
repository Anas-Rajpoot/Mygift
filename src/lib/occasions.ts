import type { Occasion } from '@/types/product'

export interface OccasionData {
  id: Occasion
  name: string
  lucideIcon: string
  productCount: number
  categorySlug: string
  glowColor: string
  accentColor: string
}

export const OCCASIONS: OccasionData[] = [
  { id: 'birthday', name: 'Birthday', lucideIcon: 'Cake', productCount: 48, categorySlug: 'birthday', glowColor: '#7a1a3a', accentColor: '#c4687a' },
  { id: 'anniversary', name: 'Anniversary', lucideIcon: 'Heart', productCount: 32, categorySlug: 'anniversary', glowColor: '#6b3a15', accentColor: '#c9a84c' },
  { id: 'eid', name: 'Eid', lucideIcon: 'Star', productCount: 36, categorySlug: 'eid', glowColor: '#1a4a25', accentColor: '#5aaa7a' },
  { id: 'wedding', name: 'Wedding', lucideIcon: 'Sparkles', productCount: 24, categorySlug: 'wedding', glowColor: '#1a2a5c', accentColor: '#6a8add' },
  { id: 'mothers-day', name: "Mother's Day", lucideIcon: 'Flower2', productCount: 19, categorySlug: 'mothers-day', glowColor: '#5c1a4a', accentColor: '#c4687a' },
  { id: 'valentines-day', name: "Valentine's Day", lucideIcon: 'HeartHandshake', productCount: 27, categorySlug: 'valentines-day', glowColor: '#6b1b1b', accentColor: '#c4687a' },
]
