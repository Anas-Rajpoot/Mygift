export interface WooProduct {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  images: Array<{ id: number; src: string; alt: string }>
  categories: Array<{ id: number; name: string; slug: string }>
  tags: Array<{ id: number; name: string; slug: string }>
  attributes: Array<{ id: number; name: string; options: string[] }>
  variations: number[]
  meta_data: Array<{ key: string; value: string }>
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  regularPrice: number
  salePrice: number | null
  onSale: boolean
  inStock: boolean
  images: string[]
  category: ProductCategory
  tags: string[]
  attributes: Record<string, string[]>
}

export type ProductCategory =
  | 'gifts-hampers'
  | 'clothing'
  | 'watches-accessories'
  | 'digital'
  | 'flowers-cakes'

export type Occasion =
  | 'birthday'
  | 'anniversary'
  | 'eid'
  | 'wedding'
  | 'mothers-day'
  | 'valentines-day'
