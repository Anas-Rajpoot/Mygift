import { OCCASIONS } from '@/lib/occasions'

export async function fetchOccasions() {
  try {
    const res = await fetch('/api/admin/occasions', { cache: 'no-store' })
    if (!res.ok) return OCCASIONS
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) return OCCASIONS
    return rows.map((row: Record<string, unknown>) => ({
      id: String(row.slug || ''),
      name: String(row.name || ''),
      lucideIcon: String(row.lucideIcon || 'Sparkles'),
      glowColor: String(row.glowColor || '#c9a84c'),
      accentColor: String(row.accentColor || '#c4687a'),
      categorySlug: String(row.categorySlug || ''),
      blurb: String(row.description || ''),
    }))
  } catch {
    return OCCASIONS
  }
}

export { OCCASIONS }
