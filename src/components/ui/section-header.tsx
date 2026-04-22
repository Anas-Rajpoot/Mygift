export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="block w-8 h-px bg-[var(--gold)] opacity-50" />
        <span className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
          {eyebrow}
        </span>
        <span className="block w-8 h-px bg-[var(--gold)] opacity-50" />
      </div>
      <h2 className="font-heading font-light text-4xl md:text-5xl text-[var(--cream)] leading-tight">
        {title}
      </h2>
    </div>
  );
}
