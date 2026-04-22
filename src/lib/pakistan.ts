export const PK_CITIES = [
  { id: 'karachi', name: 'Karachi', sameDay: true, mapX: 18, mapY: 72 },
  { id: 'lahore', name: 'Lahore', sameDay: true, mapX: 45, mapY: 28 },
  { id: 'islamabad', name: 'Islamabad', sameDay: true, mapX: 48, mapY: 22 },
  { id: 'multan', name: 'Multan', sameDay: true, mapX: 38, mapY: 40 },
  { id: 'peshawar', name: 'Peshawar', sameDay: false, mapX: 38, mapY: 18 },
  { id: 'faisalabad', name: 'Faisalabad', sameDay: false, mapX: 42, mapY: 32 },
  { id: 'rawalpindi', name: 'Rawalpindi', sameDay: false, mapX: 47, mapY: 24 },
  { id: 'quetta', name: 'Quetta', sameDay: false, mapX: 22, mapY: 45 },
  { id: 'other', name: 'Other city', sameDay: false, mapX: null, mapY: null },
] as const

export const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Wife',
  'Husband',
  'Sister',
  'Brother',
  'Son',
  'Daughter',
  'Friend',
  'Colleague',
  'Other',
] as const

export const DIASPORA_COUNTRIES = [
  { name: 'United Kingdom', currency: 'GBP', symbol: '£', lucideIcon: 'Globe' },
  { name: 'United States', currency: 'USD', symbol: '$', lucideIcon: 'Globe' },
  { name: 'Canada', currency: 'CAD', symbol: 'CA$', lucideIcon: 'Globe' },
  { name: 'UAE', currency: 'AED', symbol: 'د.إ', lucideIcon: 'Globe' },
  { name: 'Australia', currency: 'AUD', symbol: 'A$', lucideIcon: 'Globe' },
  { name: 'Europe', currency: 'EUR', symbol: '€', lucideIcon: 'Globe' },
] as const
