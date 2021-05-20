import { writable } from 'svelte/store'

// export type MetricsStore = ReturnType<typeof newInsightsContextStore>
type InsightContext = {
  insight: string | undefined
  from: string | undefined
  to: string | undefined
}

const DEFAULT: InsightContext = {
  insight: undefined,
  from: undefined,
  to: undefined,
}

export function newInsightsContextStore() {
  const InsightContext = Object.assign({}, DEFAULT)
  const { subscribe, set } = writable(InsightContext)

  return {
    subscribe,
    set(newInsight, from: string, to: string) {
      InsightContext.insight =
        newInsight === InsightContext.insight ? undefined : newInsight

      if (from && to) {
        InsightContext.from = from
        InsightContext.to = to
      }

      set(InsightContext)
    },
    apply(value: any) {
      Object.assign(InsightContext, value)
      set(InsightContext)
    },
    changePeriod(from: string, to: string) {
      InsightContext.from = from
      InsightContext.to = to
      set(InsightContext)
    },
  }
}
