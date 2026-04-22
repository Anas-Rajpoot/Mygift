import { redirect } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string; orderby?: string; order?: string }>
}

function buildCanonicalShopHref(categorySlug: string, searchParams: { page?: string; orderby?: string; order?: string }) {
  const qs = new URLSearchParams()
  qs.set('category', categorySlug)
  if (searchParams.page) qs.set('page', searchParams.page)
  if (searchParams.orderby) qs.set('orderby', searchParams.orderby)
  if (searchParams.order) qs.set('order', searchParams.order)
  return `/shop?${qs.toString()}`
}

export default async function CategoryRouteRedirect({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const resolved = await searchParams
  redirect(buildCanonicalShopHref(categorySlug, resolved))
}
