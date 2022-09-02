import { get } from 'svelte/store'
import { withScroll } from 'san-webkit/lib/ui/history'
import { selectedItems } from './../../lib/stores/selector'
import { SelectorType } from './../../lib/metrics/selector/types'
const chartWidgetFinder = ({ Metrics, isBlocked }) => !isBlocked && !!Metrics
const findChartWidget = (widgets) => widgets.find(chartWidgetFinder)
export function handleItemSelect(item, e, Widgets, Sidewidget, History, adjustSelectedMetric) {
  const { selectorType } = item
  if (selectorType === SelectorType.Sidewidget) {
    return Sidewidget.set(item === get(Sidewidget) ? null : item)
  }
  if (selectorType === SelectorType.Widget) {
    return Widgets.new(item)
  }
  const isCtrl = e.ctrlKey || e.metaKey
  const widget = isCtrl && findChartWidget(get(Widgets))
  if (!widget) return selectedItems.toggle(item)
  if (selectorType === SelectorType.Subwidget) {
    return Widgets.addSubwidgets(widget, [item])
  }
  if (selectorType === SelectorType.ChartAddon) {
    return widget.ChartAddons.add(item)
  }
  const isNotable = selectorType === SelectorType.Notable
  let metric = item.metric || item
  metric =
    (adjustSelectedMetric === null || adjustSelectedMetric === void 0
      ? void 0
      : adjustSelectedMetric(metric)) || metric
  const metrics = [metric]
  if (e.shiftKey) {
    const widget = Widgets.add(metrics, isNotable ? metrics : undefined)
    History === null || History === void 0
      ? void 0
      : History.add(
          'New widget',
          () => {
            var _a
            return (_a = widget.delete) === null || _a === void 0 ? void 0 : _a.call(widget)
          },
          () => ((widget.scrollOnMount = true), Widgets.push(widget)),
        )
    return
  }
  const { Metrics, MetricsSignals } = widget
  const oldMetrics = get(Metrics).slice()
  const oldSignals = get(MetricsSignals).slice()
  const redo = () => (Metrics.add(metric), isNotable && MetricsSignals.concat(metrics))
  redo()
  History === null || History === void 0
    ? void 0
    : History.add(
        'Add metrics',
        withScroll(widget, () => (Metrics.set(oldMetrics), MetricsSignals.set(oldSignals))),
        withScroll(widget, redo),
      )
}
//# sourceMappingURL=controller.js.map
