'use client'

import { useCallback, useEffect, useState } from 'react'
import { createItem, deleteItem, fetchCollection, updateItem } from './admin-api'

export function useAdminCollection<T extends { id: string }>(collection: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const rows = await fetchCollection<T>(collection)
      setData(rows)
    } finally {
      setLoading(false)
    }
  }, [collection])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback(
    async (payload: Partial<T>) => {
      setSaving(true)
      try {
        if (payload.id) {
          await updateItem<T>(collection, payload.id, payload)
        } else {
          await createItem<T>(collection, payload)
        }
        await reload()
      } finally {
        setSaving(false)
      }
    },
    [collection, reload],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteItem(collection, id)
      await reload()
    },
    [collection, reload],
  )

  return { data, loading, saving, save, remove, reload }
}
