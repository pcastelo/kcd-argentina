import type { SVGProps } from 'react'

export function LinktreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.95 13.49l-3.34 3.35 2.21 2.2 3.57-3.57v4.23h3.14v-4.22l3.57 3.57 2.21-2.21-3.35-3.35h4.24v-3.13h-4.43l3.53-3.51-2.21-2.22L12 9.72 6.91 4.63 4.7 6.85l3.53 3.51H3.79v3.13h4.16z" />
      <rect x="10.37" y="17.83" width="3.14" height="4.17" rx=".2" />
      <rect x="10.37" y="2" width="3.14" height="4.17" rx=".2" />
    </svg>
  )
}
