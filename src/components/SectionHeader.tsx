type SectionHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: string
  note?: string
  badge?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  note,
  badge,
}: SectionHeaderProps) {
  return (
    <div className="text-center">
      <p className="text-xl font-semibold uppercase tracking-[0.22em] text-primary sm:text-2xl">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-col items-center gap-3">
        <h2 className="text-lg font-bold text-text sm:text-xl">{title}</h2>
        {badge ? (
          <span
            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {badge}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">{subtitle}</p>
      ) : null}
      {note ? (
        <p className="mx-auto mt-2 max-w-2xl text-xs text-text-muted">{note}</p>
      ) : null}
    </div>
  )
}
