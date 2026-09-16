import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { CodeOfConductSection } from '@/sections/CodeOfConductSection'

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CodeOfConductSection />
    </I18nextProvider>,
  )
}

describe('CodeOfConductSection', () => {
  it('renders Spanish code of conduct and contact email', async () => {
    await i18n.changeLanguage('es')

    renderSection()

    expect(
      screen.getByRole('heading', {
        name: i18n.t('conduct.title'),
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Comportamiento esperado/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /C\u00f3digo de Conducta de la CNCF/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Intimidaci\u00f3n, persecuci\u00f3n/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'kcd.argentina@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:kcd.argentina@gmail.com')
  })
})
