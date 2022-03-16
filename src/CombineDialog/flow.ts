import { withScroll } from 'webkit/ui/history'

export function updateCombinedMetric(metric, updatedMetric, context) {
  const { History, widget, onUpdate } = context

  const oldMetric = Object.assign({}, metric)
  const update = (newMetric: any) => {
    metric.expression = newMetric.expression
    metric.label = newMetric.label
    metric.minInterval = newMetric.minInterval
    metric.baseMetrics = newMetric.baseMetrics
    onUpdate()
  }

  update(updatedMetric)
  History.add(
    'Combined metric change',
    withScroll(widget, () => update(oldMetric)),
    withScroll(widget, () => update(updatedMetric)),
  )
}
