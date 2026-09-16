import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={`py-12 sm:py-16${className ? ` ${className}` : ''}`}>
      {children}
    </section>
  )
}
