'use server'

export async function fetchDiasporaProducts(categorySlug: string) {
  const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET
  if (!WC_URL || !WC_KEY || !WC_SECRET) return { products: [], usedFallback: false }

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  let url = `${WC_URL}/wp-json/wc/v3/products?per_page=50&status=publish`

  if (categorySlug !== 'all') {
    const catRes = await fetch(`${WC_URL}/wp-json/wc/v3/products/categories?slug=${categorySlug}`, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 3600 },
    })
    const cats = catRes.ok ? await catRes.json() : []
    if (Array.isArray(cats) && cats.length > 0) {
      url = `${WC_URL}/wp-json/wc/v3/products?category=${cats[0].id}&per_page=50&status=publish`
    }
  }

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) return { products: [], usedFallback: false }
  const products = await res.json()

  if (products.length === 0 && categorySlug !== 'all') {
    const fallbackRes = await fetch(`${WC_URL}/wp-json/wc/v3/products?per_page=50&status=publish`, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 300 },
    })
    const fallbackProducts = fallbackRes.ok ? await fallbackRes.json() : []
    return { products: fallbackProducts, usedFallback: true }
  }

  return { products, usedFallback: false }
}

export async function fetchDiasporaCategories() {
  const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET
  if (!WC_URL || !WC_KEY || !WC_SECRET) return []
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
  const res = await fetch(`${WC_URL}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  return res.json()
}
