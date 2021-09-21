import { get } from 'svelte/store'
import { withScroll } from 'webkit/ui/history'
import { selectedItems } from '@/stores/selector'
import { SelectorType } from '@/metrics/selector/types'

const chartWidgetFinder = ({ Metrics, isBlocked }) => !isBlocked && !!Metrics
const findChartWidget = (widgets: any) => widgets.find(chartWidgetFinder)

export function handleItemSelect(
  item,
  e: MouseEvent,
  Widgets,
  Sidewidget,
  History: undefined | any,
  adjustSelectedMetric,
) {
  const { selectorType } = item

  if (selectorType === SelectorType.Sidewidget) {
    return Sidewidget.set(item === get(Sidewidget) ? null : item)
  }
  if (selectorType === SelectorType.Widget) {
    return Widgets.new(item)
  }

  const isCtrl = e.ctrlKey || e.metaKey
  const widget = isCtrl && findChartWidget(get<any>(Widgets))

  if (!widget) return selectedItems.toggle(item)

  if (selectorType === SelectorType.Subwidget) {
    return Widgets.addSubwidgets(widget, [item])
  }
  if (selectorType === SelectorType.ChartAddon) {
    return widget.ChartAddons.add(item)
  }

  const isNotable = selectorType === SelectorType.Notable
  let metric = item.metric || item
  metric = adjustSelectedMetric?.(metric) || metric

  const metrics = [metric]
  if (e.shiftKey) {
    const widget = Widgets.add(metrics, isNotable ? metrics : undefined)
    History?.add(
      'New widget',
      () => widget.delete?.(),
      () => ((widget.scrollOnMount = true), Widgets.push(widget)),
    )
    return
  }

  const { Metrics, MetricsSignals } = widget
  const oldMetrics = get<any>(Metrics).slice()
  const oldSignals = get<any>(MetricsSignals).slice()
  const redo = () => (
    Metrics.add(metric), isNotable && MetricsSignals.concat(metrics)
  )

  redo()
  History?.add(
    'Add metrics',
    withScroll(
      widget,
      () => (Metrics.set(oldMetrics), MetricsSignals.set(oldSignals)),
    ),
    withScroll(widget, redo),
  )
}
