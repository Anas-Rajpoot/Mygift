export function normalizeBaseUrl(value?: string | null): string {
  return (value || '').trim().replace(/\.$/, '').replace(/\/+$/, '')
}

