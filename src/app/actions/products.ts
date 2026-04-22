'use server'

import { wooCommerce } from '@/lib/woocommerce'

export async function fetchProductsByCategory(categorySlug: string) {
  try {
    if (categorySlug === 'all') {
      return await wooCommerce.products.list({ per_page: 50, status: 'publish' })
    }

    const category = await wooCommerce.categories.getBySlug(categorySlug)
    if (!category) return []

    return await wooCommerce.products.list({
      category: String(category.id),
      per_page: 50,
      status: 'publish',
    })
  } catch {
    return []
  }
}

export async function fetchAllCategories() {
  try {
    return await wooCommerce.categories.list({ per_page: 100, hide_empty: true })
  } catch {
    return []
  }
}
