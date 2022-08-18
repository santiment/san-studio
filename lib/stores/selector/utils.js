import { SelectorType } from './../../../lib/metrics/selector/types'
export const Selectable = {
  Metrics: 'metrics',
  Notables: 'notables',
  Subwidgets: 'subwidgets',
  ChartAddons: 'chartAddons',
}
const selectables = Object.values(Selectable)
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
}
export const each = (clb) => selectables.forEach(clb)
export function getSelectableType(item) {
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
//# sourceMappingURL=utils.js.map
