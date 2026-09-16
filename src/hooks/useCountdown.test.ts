import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computeCountdown, useCountdown } from '@/hooks/useCountdown'

describe('computeCountdown', () => {
  const startIso = '2026-10-03T09:00:00-03:00'
  const endIso = '2026-10-03T19:00:00-03:00'

  it('returns remaining time before the event starts', () => {
    const now = new Date('2026-10-01T09:00:00-03:00').getTime()

    expect(computeCountdown(now, startIso, endIso)).toEqual({
      days: 2,
      hours: 0,
      minutes: 0,
      seconds: 0,
      phase: 'before',
    })
  })

  it('returns during phase when the event has started', () => {
    const now = new Date('2026-10-03T10:00:00-03:00').getTime()

    expect(computeCountdown(now, startIso, endIso)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      phase: 'during',
    })
  })

  it('returns after phase when the event has ended', () => {
    const now = new Date('2026-10-03T20:00:00-03:00').getTime()

    expect(computeCountdown(now, startIso, endIso)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      phase: 'after',
    })
  })
})

describe('useCountdown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('cleans up the interval on unmount', () => {
    vi.useFakeTimers()
    const startIso = '2026-10-03T09:00:00-03:00'
    const endIso = '2026-10-03T19:00:00-03:00'
    const getNow = () => new Date('2026-10-03T08:59:58-03:00').getTime()

    const { unmount } = renderHook(() =>
      useCountdown(startIso, endIso, getNow),
    )

    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
