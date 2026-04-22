'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

const STEP = 500

function snap(value: number) {
  return Math.round(value / STEP) * STEP
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)

  const safeRange = Math.max(max - min, STEP)
  const [minValue, maxValue] = value

  const minPercent = useMemo(() => ((minValue - min) / safeRange) * 100, [min, minValue, safeRange])
  const maxPercent = useMemo(() => ((maxValue - min) / safeRange) * 100, [maxValue, min, safeRange])

  useEffect(() => {
    if (!dragging) return

    const onMouseMove = (event: MouseEvent) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const raw = min + ratio * safeRange
      const snapped = snap(raw)

      if (dragging === 'min') {
        const nextMin = clamp(snapped, min, maxValue - STEP)
        onChange([nextMin, maxValue])
      } else {
        const nextMax = clamp(snapped, minValue + STEP, max)
        onChange([minValue, nextMax])
      }
    }

    const onMouseUp = () => setDragging(null)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging, max, maxValue, min, minValue, onChange, safeRange])

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-lufga text-sm font-semibold text-gold">₨{minValue.toLocaleString('en-PK')}</div>
          <div className="font-lufga text-[10px] text-muted">Min</div>
        </div>
        <div className="text-right">
          <div className="font-lufga text-sm font-semibold text-gold">₨{maxValue.toLocaleString('en-PK')}</div>
          <div className="font-lufga text-[10px] text-muted">Max</div>
        </div>
      </div>

      <div ref={trackRef} className="relative h-5">
        <div className="absolute top-1/2 h-[2px] w-full -translate-y-1/2 bg-[rgba(201,168,76,0.15)]" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gold"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        <button
          type="button"
          aria-label="Minimum price"
          onMouseDown={() => setDragging('min')}
          className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-gold"
          style={{ left: `${minPercent}%`, cursor: dragging ? 'grabbing' : 'grab' }}
        />
        <button
          type="button"
          aria-label="Maximum price"
          onMouseDown={() => setDragging('max')}
          className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-gold"
          style={{ left: `${maxPercent}%`, cursor: dragging ? 'grabbing' : 'grab' }}
        />
      </div>
    </div>
  )
}
