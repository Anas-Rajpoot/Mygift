'use client'

export const ADMIN_TOKEN_KEY = 'admin-token'

export function getAdminToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
}

export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const token = getAdminToken()
  if (token) headers.set('x-admin-token', token)
  if (!headers.get('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  return res.json() as Promise<T>
}

export async function fetchCollection<T>(collection: string) {
  return adminFetch<T[]>(`/api/admin/${collection}`)
}

export async function createItem<T>(collection: string, payload: Partial<T>) {
  return adminFetch<T>(`/api/admin/${collection}`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateItem<T>(collection: string, id: string, payload: Partial<T>) {
  return adminFetch<T>(`/api/admin/${collection}/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteItem(collection: string, id: string) {
  return adminFetch<{ success: boolean }>(`/api/admin/${collection}/${id}`, { method: 'DELETE' })
}
