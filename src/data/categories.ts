import type { BoxOption } from '@/types/giftlab'

export async function fetchBoxOptions(): Promise<BoxOption[]> {
  try {
    const res = await fetch('/api/admin/giftlab-boxes', { cache: 'no-store' })
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map((row: Record<string, unknown>) => ({
      id: String(row.size || row.id) as BoxOption['id'],
      name: String(row.name || ''),
      basePrice: Number(row.basePrice || 0),
      maxItems: Number(row.maxItems || 0),
      dimensions: String(row.dimensions || ''),
    }))
  } catch {
    return []
  }
}
