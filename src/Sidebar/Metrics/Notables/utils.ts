import { ONE_DAY_IN_MS } from 'webkit/utils/dates'
import { NotableSignal, getNotableItem } from '@/metrics/_notables'
import { checkIsFilterMatch } from '@/metrics/selector/utils'

export function getNotableMetrics(signals, searchTerm) {
  return signals
    .map((key) => {
      const signal = NotableSignal[key]

      if (!signal) return
      if (searchTerm && !checkIsFilterMatch(searchTerm, signal.metric)) return

      return getNotableItem(signal)
    })
    .filter(Boolean)
}

export function getSettings({ slug }, { from, to }) {
  const diff = (+new Date(to) - +new Date(from)) / ONE_DAY_IN_MS
  let interval = '7d'

  if (diff < 15) interval = '12h'
  else if (diff < 40) interval = '1d'
  else if (diff < 120) interval = '2d'
  else if (diff < 250) interval = '5d'

  return { slug, from, to, interval }
}
