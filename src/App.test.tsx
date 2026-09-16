import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('App', () => {
  it('renders KCD Argentina placeholder home', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText(/Kubernetes Community Days Argentina/i)).toBeInTheDocument()
  })
})
