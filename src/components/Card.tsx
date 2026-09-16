import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className, glow = false }: CardProps) {
  const glowClasses = glow
    ? 'shadow-[0_0_16px_color-mix(in_srgb,var(--color-glow)_35%,transparent)]'
    : ''

  return (
    <div
      className={`rounded-lg border border-border bg-surface${glow ? ` ${glowClasses}` : ''}${className ? ` ${className}` : ' p-6'}`}
    >
      {children}
    </div>
  )
}
