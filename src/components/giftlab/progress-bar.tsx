'use client'

import { useGiftLabStore } from '@/stores/giftlabStore'

const labels = ['Occasion', 'Box', 'Items', 'Personalize', 'Review']

export function GiftLabProgressBar() {
  const step = useGiftLabStore((s) => s.step)

  return (
    <div className="mx-auto max-w-5xl px-6 pt-8">
      <div className="grid grid-cols-5 items-center gap-2">
        {labels.map((label, index) => {
          const current = index + 1
          const active = current === step
          const complete = current < step
          return (
            <div key={label} className="relative text-center">
              <div className="mx-auto mb-3 flex items-center justify-center">
                <span
                  className="h-4 w-4 rounded-full border"
                  style={{
                    borderColor: '#c9a84c',
                    backgroundColor: active || complete ? '#c9a84c' : 'transparent',
                  }}
                />
              </div>
              {index < labels.length - 1 && (
                <span className="absolute left-[58%] top-2 hidden h-px w-[88%] bg-[#c9a84c]/40 md:block" />
              )}
              <p className="font-lufga text-[11px] text-[#8a7060]">{label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
