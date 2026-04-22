'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'

interface AdminModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSave: () => void
  saving: boolean
}

export function AdminModal({ open, onClose, title, children, onSave, saving }: AdminModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-[rgba(26,12,16,0.5)]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 top-0 z-[100] flex h-screen w-[560px] max-w-[90vw] flex-col border-l border-[#e8e0d4] bg-white"
          >
            <header className="flex h-16 items-center justify-between border-b border-[#e8e0d4] px-6">
              <h2 className="font-lufga text-lg font-semibold text-[#1a0c10]">{title}</h2>
              <button type="button" onClick={onClose} className="text-[#8a7060]">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            <footer className="flex h-[72px] items-center justify-end gap-3 border-t border-[#e8e0d4] px-6">
              <button type="button" onClick={onClose} className="px-4 py-2 font-lufga text-sm text-[#6b5c4e]">
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#c9a84c] px-7 py-2.5 font-lufga text-sm font-semibold text-[#0f0608] disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
