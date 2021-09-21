import { SelectorType } from '@/metrics/selector/types'

export const Selectable = {
  Metrics: 'metrics',
  Notables: 'notables',
  Subwidgets: 'subwidgets',
  ChartAddons: 'chartAddons',
} as const
const selectables = Object.values(Selectable)

export type Selectables = typeof selectables[number]

export type SetOf = { [key in Selectables]: Set<any> } & {
  all: Set<any>
}
export type Store = { [key in Selectables]: any[] } & {
  has: (item: any) => boolean
}

type SelectablesModifier = (
  item: any,
  store: Store,
  setOf: SetOf,
  hasItem: boolean,
) => void

export const SelectableModifier = {
  [Selectable.Notables]: (item, store, setOf, hasItem) => {
    const metricsSet = setOf[Selectable.Metrics]
    if (hasItem) {
      metricsSet.delete(item.metric)
    } else {
      metricsSet.add(item.metric)
    }
    store[Selectable.Metrics] = Array.from(metricsSet)
  },
} as { [key in Selectables]?: SelectablesModifier }

export const each = (clb: (selectable: Selectables) => any): void =>
  selectables.forEach(clb)

export function getSelectableType(item: any): Selectables {
  switch (item.selectorType) {
    case SelectorType.Notable:
      return Selectable.Notables
    case SelectorType.Subwidget:
      return Selectable.Subwidgets
    case SelectorType.ChartAddon:
      return Selectable.ChartAddons
    default:
      return Selectable.Metrics
  }
}
