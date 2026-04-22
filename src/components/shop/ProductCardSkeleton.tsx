export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden border border-[rgba(201,168,76,0.06)] bg-[#1a0c10]">
      <div className="aspect-[4/3] animate-[pulse_2s_ease-in-out_infinite] bg-[rgba(253,244,232,0.04)]" />
      <div className="p-5">
        <div className="mb-3 h-[10px] w-[60px] animate-[pulse_2s_ease-in-out_infinite] bg-[rgba(253,244,232,0.04)]" />
        <div className="mb-1.5 h-4 w-[90%] animate-[pulse_2s_ease-in-out_infinite_0.1s] bg-[rgba(253,244,232,0.05)]" />
        <div className="mb-5 h-4 w-[60%] animate-[pulse_2s_ease-in-out_infinite_0.2s] bg-[rgba(253,244,232,0.04)]" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 animate-[pulse_2s_ease-in-out_infinite_0.3s] bg-[rgba(201,168,76,0.08)]" />
          <div className="h-9 w-9 animate-[pulse_2s_ease-in-out_infinite_0.4s] bg-[rgba(253,244,232,0.04)]" />
        </div>
      </div>
    </div>
  )
}
