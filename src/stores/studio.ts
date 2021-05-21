import { writable } from 'svelte/store'
import { ONE_DAY_IN_MS } from 'webkit/utils/dates'

type StudioSettings = {
  slug: string
  from: string
  to: string
  interval: string
  ticker: string
}

export const STUDIO = {
  slug: 'ethereum',
  ticker: 'ETH',
  from: '2021-01-16T21:00:00.000Z',
  interval: '4h',
  to: '2021-05-11T21:00:00.000Z',
}

const { update, subscribe, set } = writable<StudioSettings>(STUDIO)

function getPeriodInterval(from: Date, to: Date): string {
  const diff = (+to - +from) / ONE_DAY_IN_MS

  if (diff < 7) return '5m'
  if (diff < 14) return '15m'
  if (diff < 20) return '30m'
  if (diff < 33) return '1h'
  if (diff < 63) return '2h'
  if (diff < 100) return '3h'
  if (diff < 185) return '4h'
  if (diff < 360) return '8h'
  if (diff < 800) return '12h'
  if (diff < 1400) return '1d'

  return '7d'
}

const get = () => STUDIO
export const studio = {
  subscribe,
  get,
  setProject(project) {
    Object.assign(STUDIO, project)
    set(STUDIO)
  },
  setPeriod(from: Date, to: Date) {
    STUDIO.from = from.toISOString()
    STUDIO.to = to.toISOString()
    STUDIO.interval = getPeriodInterval(from, to)
    set(STUDIO)
  },
}

declare global {
  const $studio: StudioSettings
}
