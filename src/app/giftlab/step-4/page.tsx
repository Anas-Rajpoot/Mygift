'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GiftLabProgressBar } from '@/components/giftlab/progress-bar'
import { GiftLabSidebar } from '@/components/giftlab/sidebar'
import { useGiftLabStore } from '@/stores/giftlabStore'
import { ADD_ONS, fetchGiftLabAddOns, type AddOn } from '@/types/giftlab'

export default function GiftLabStep4Page() {
  const router = useRouter()
  const message = useGiftLabStore((s) => s.message)
  const senderName = useGiftLabStore((s) => s.senderName)
  const setMessage = useGiftLabStore((s) => s.setMessage)
  const setSenderName = useGiftLabStore((s) => s.setSenderName)
  const selectedAddOns = useGiftLabStore((s) => s.selectedAddOns)
  const toggleAddOn = useGiftLabStore((s) => s.toggleAddOn)
  const setStep = useGiftLabStore((s) => s.setStep)
  const setAddOnCatalog = useGiftLabStore((s) => s.setAddOnCatalog)
  const total = useGiftLabStore((s) => s.getLiveTotal())
  const selectedItems = useGiftLabStore((s) => s.selectedItems)
  const [addOns, setAddOns] = useState<AddOn[]>(ADD_ONS)

  useEffect(() => {
    setStep(4)
  }, [setStep])

  useEffect(() => {
    fetchGiftLabAddOns().then((rows) => {
      if (rows.length) {
        setAddOns(rows)
        setAddOnCatalog(rows)
      }
    })
  }, [setAddOnCatalog])

  return (
    <div className="-mt-14 min-h-screen bg-[#0f0608] px-6 pb-24 pt-8 text-[#fdf4e8] lg:-mt-[104px]">
      <GiftLabProgressBar />
      <div className="mx-auto mt-10 max-w-7xl lg:flex lg:gap-8">
        <section className="flex-1 space-y-6">
          <div className="border border-[#c9a84c]/20 bg-[#fdf4e8] p-8 text-[#2a1a14]">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 200))}
              className="min-h-[220px] w-full resize-none bg-transparent font-lufga text-lg italic outline-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(201,168,76,0.15) 28px)',
                backgroundSize: '100% 28px',
              }}
            />
            <div className="mt-3 flex items-center justify-between">
              <input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="From: ___" className="border-b border-[#c9a84c]/60 bg-transparent pb-1 outline-none" />
              <span className={message.length > 180 ? 'text-[#c4687a]' : ''}>{message.length}/200</span>
            </div>
          </div>
          <div className="space-y-2">
            {addOns.map((addOn) => {
              const active = selectedAddOns.includes(addOn.id)
              return (
                <button key={addOn.id} onClick={() => toggleAddOn(addOn.id)} className={`flex w-full items-center justify-between border p-3 ${active ? 'border-[#c9a84c] bg-[#c9a84c]/8' : 'border-[#c9a84c]/20'}`}>
                  <span>{addOn.name}</span>
                  <span className="text-[#c9a84c]">Rs {Number(addOn.price).toLocaleString('en-PK')}</span>
                </button>
              )
            })}
          </div>
        </section>
        <div className="mt-8 hidden lg:block">
          <GiftLabSidebar
            onContinue={() => {
              setStep(5)
              router.push('/giftlab/step-5')
            }}
          />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#c9a84c]/20 bg-[#12090b] p-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-lufga text-sm">
            {selectedItems.length} items · Rs {Number(total).toLocaleString('en-PK')} · Continue →
          </p>
          <button
            onClick={() => {
              setStep(5)
              router.push('/giftlab/step-5')
            }}
            className="bg-[#c9a84c] px-4 py-2 text-xs font-semibold text-[#0f0608]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
