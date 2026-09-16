import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('App', () => {
  it('renders KCD Argentina placeholder home at /es', async () => {
    window.history.pushState({}, '', '/es')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(
        screen.getByText(/Kubernetes Community Days Argentina/i),
      ).toBeInTheDocument()
    })
  })
})
