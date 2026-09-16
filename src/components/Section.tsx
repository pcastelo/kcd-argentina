import type { ReactNode } from 'react'

export type SectionTone = 'plain' | 'surface' | 'pattern' | 'glow'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
  tone?: SectionTone
}

const toneClasses: Record<SectionTone, string> = {
  plain: 'border-t border-border bg-bg',
  surface: 'border-t border-border bg-surface/40',
  pattern: 'overflow-hidden border-t border-border bg-bg',
  glow: 'overflow-hidden border-t border-border bg-bg',
}

function SectionBackdrop({ tone }: { tone: SectionTone }) {
  if (tone === 'pattern') {
    return (
      <>
        <div
          className="absolute inset-0 bg-[url('/images/pattern-bg.jpg')] bg-cover bg-center opacity-[0.07]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg via-bg/95 to-bg"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(56,139,253,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(56,139,253,0.04)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
          aria-hidden="true"
        />
      </>
    )
  }

  if (tone === 'glow') {
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,139,253,0.1)_0%,_transparent_58%)]"
        aria-hidden="true"
      />
    )
  }

  return null
}

export function Section({
  children,
  className,
  id,
  tone = 'plain',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-12 sm:py-16 ${toneClasses[tone]}${className ? ` ${className}` : ''}`}
    >
      <SectionBackdrop tone={tone} />
      <div className="relative z-10">{children}</div>
    </section>
  )
}
