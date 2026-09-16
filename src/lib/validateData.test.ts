import { describe, expect, it } from 'vitest'
import { validateAllData } from './validateData'

describe('validateAllData', () => {
  it('validates all committed JSON data files', () => {
    expect(() => validateAllData()).not.toThrow()
  })
})
