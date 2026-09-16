import { useEffect, useState } from 'react'

export type CountdownPhase = 'before' | 'during' | 'after'

export type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
  phase: CountdownPhase
}

export function computeCountdown(
  now: number,
  startIso: string,
  endIso: string,
): CountdownState {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()

  if (now >= end) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'after' }
  }

  if (now >= start) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'during' }
  }

  const totalSeconds = Math.floor((start - now) / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, phase: 'before' }
}

function defaultGetNow(): number {
  return Date.now()
}

export function useCountdown(
  startIso: string,
  endIso: string,
  getNow: () => number = defaultGetNow,
): CountdownState {
  const [state, setState] = useState(() =>
    computeCountdown(getNow(), startIso, endIso),
  )

  useEffect(() => {
    const tick = () => {
      setState(computeCountdown(getNow(), startIso, endIso))
    }

    tick()
    const intervalId = window.setInterval(tick, 1_000)
    return () => window.clearInterval(intervalId)
  }, [startIso, endIso, getNow])

  return state
}
