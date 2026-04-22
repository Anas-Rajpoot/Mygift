'use client'

import { useEffect } from 'react'
import { useGiftLabStore } from '@/stores/giftlabStore'

export default function GiftLabLayout({ children }: { children: React.ReactNode }) {
  const reset = useGiftLabStore((s) => s.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}
