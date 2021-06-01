import { NotableSignal } from '@/metrics/_notables'
import { SelectorType } from '@/metrics/selector/types'
import { checkIsFilterMatch } from '@/metrics/selector/utils'

export function getNotableMetrics(signals, searchTerm) {
  return signals
    .map((key) => {
      const signal = NotableSignal[key]

      if (!signal) return
      if (searchTerm && !checkIsFilterMatch(searchTerm, signal.metric)) return

      return {
        key: signal.key,
        metric: signal.metric,
        label: signal.formatter(),
        selectorType: SelectorType.Notable,
      }
    })
    .filter(Boolean)
}

export const getSettings = ({ slug, from, to }) => ({
  slug,
  from,
  to,
  interval: '2d',
})
