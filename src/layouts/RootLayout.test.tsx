import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'

describe('RootLayout', () => {
  it('renders header, main, and footer landmarks', () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          children: [{ path: '/', element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
