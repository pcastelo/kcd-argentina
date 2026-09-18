import type { SVGProps } from 'react'

/** Simple CNCF-style cloud mark for community event links. */
export function CncfIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.5 18.5h-11A4.5 4.5 0 0 1 4.2 10.3 5.75 5.75 0 0 1 15.3 8.1a4.26 4.26 0 0 1 2.2 10.4Zm-11-1.5h11a2.75 2.75 0 0 0 .2-5.5l-.35-.02a1 1 0 0 1-.92-.77 4.25 4.25 0 0 0-8.25.55 1 1 0 0 1-.9.78A3 3 0 0 0 6.5 17Z" />
    </svg>
  )
}
