'use client'

export function AdminPageHeader({ title, onAdd, addLabel = 'Add New' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-lufga text-2xl font-semibold text-[#1a0c10]">{title}</h1>
      {onAdd && (
        <button type="button" onClick={onAdd} className="bg-[#c9a84c] px-4 py-2 font-lufga text-sm font-semibold text-[#0f0608]">
          {addLabel}
        </button>
      )}
    </div>
  )
}

export function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (next: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return
        onChange(!checked)
      }}
      disabled={disabled}
      className={`relative h-6 w-10 ${checked ? 'bg-[#c9a84c]' : 'bg-[#d9d0c2]'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 bg-white transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}
