'use server'

export interface ShopFilters {
  category?: string
  occasion?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  inStock?: boolean
  search?: string
  page?: number
  perPage?: number
}

export async function fetchShopProducts(filters: ShopFilters) {
  try {
    const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET
    if (!WC_URL || !WC_KEY || !WC_SECRET) return { products: [], total: 0, totalPages: 0 }
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    const params = new URLSearchParams()
    params.set('per_page', String(filters.perPage ?? 24))
    params.set('page', String(filters.page ?? 1))
    params.set('status', 'publish')

    if (filters.category) params.set('category', filters.category)
    if (filters.onSale) params.set('on_sale', 'true')
    if (filters.minPrice) params.set('min_price', String(filters.minPrice))
    if (filters.maxPrice) params.set('max_price', String(filters.maxPrice))
    if (filters.inStock) params.set('stock_status', 'instock')
    if (filters.search) params.set('search', filters.search)

    const sortMap: Record<string, { orderby: string; order: string }> = {
      newest: { orderby: 'date', order: 'desc' },
      oldest: { orderby: 'date', order: 'asc' },
      'price-asc': { orderby: 'price', order: 'asc' },
      'price-desc': { orderby: 'price', order: 'desc' },
      popular: { orderby: 'popularity', order: 'desc' },
      rating: { orderby: 'rating', order: 'desc' },
    }
    const sortOpts = sortMap[filters.sort ?? 'newest'] ?? sortMap.newest
    params.set('orderby', sortOpts.orderby)
    params.set('order', sortOpts.order)

    const res = await fetch(`${WC_URL}/wp-json/wc/v3/products?${params.toString()}`, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 120 },
    })

    if (!res.ok) return { products: [], total: 0, totalPages: 0 }

    const products = await res.json()
    const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10)
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10)

    return { products, total, totalPages }
  } catch {
    return { products: [], total: 0, totalPages: 0 }
  }
}

export async function fetchShopCategories() {
  try {
    const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      console.error('WooCommerce env vars missing')
      return []
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true&orderby=count&order=desc`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    )

    if (!res.ok) {
      console.error('Categories fetch failed:', res.status, res.statusText)
      return []
    }

    const data = await res.json()

    return data.filter((cat: { slug: string; count: number }) => cat.slug !== 'uncategorized' && cat.count > 0)
  } catch (err) {
    console.error('fetchShopCategories error:', err)
    return []
  }
}

export async function fetchPriceRange() {
  try {
    const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET
    if (!WC_URL || !WC_KEY || !WC_SECRET) return { min: 0, max: 50000 }
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    const [cheapRes, expRes] = await Promise.all([
      fetch(`${WC_URL}/wp-json/wc/v3/products?orderby=price&order=asc&per_page=1&status=publish`, {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 3600 },
      }),
      fetch(`${WC_URL}/wp-json/wc/v3/products?orderby=price&order=desc&per_page=1&status=publish`, {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 3600 },
      }),
    ])

    if (!cheapRes.ok || !expRes.ok) return { min: 0, max: 50000 }

    const cheap = await cheapRes.json()
    const expensive = await expRes.json()

    return {
      min: Math.floor(Number(cheap[0]?.price ?? 0)),
      max: Math.ceil(Number(expensive[0]?.price ?? 50000)),
    }
  } catch {
    return { min: 0, max: 50000 }
  }
}
