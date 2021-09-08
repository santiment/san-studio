import { newURLQuery } from '@/sharing'

const keyAccessor = ({ key }) => key
const shareMetrics = (metrics) => metrics.map(keyAccessor)

const isEmptyObject = (obj) => Object.keys(obj).length === 0

function shareIndicators(MetricIndicators) {
  let result
  Object.entries(MetricIndicators || {}).forEach(([key, value]: any) => {
    if (value.size === 0) return
    if (!result) result = {}
    result[key] = Array.from(value).map(keyAccessor)
  })
  return result
}

function shareCombinedMetrics(metrics) {
  return metrics
    .filter(({ expression }) => expression)
    .map(({ key, expression, label, baseMetrics }) => ({
      k: key,
      exp: expression,
      l: label,
      bm: shareMetrics(baseMetrics),
    }))
}

const shareAxesMetrics = (axesMetrics) =>
  Array.from(axesMetrics || []).map(keyAccessor)

function shareMetricSettings(MetricSettings) {
  let result
  Object.entries(MetricSettings || {}).forEach(([key, _value]: any) => {
    const value = Object.assign({}, _value)
    delete value.getPreTransformValue
    delete value.preTransform
    if (isEmptyObject(value)) return
    if (!result) result = {}
    result[key] = value
  })
  return result
}

export function getViewOnSantimentLink(settings, widget) {
  const { from, to, slug, ticker } = settings
  const { metrics, metricIndicators, colors, axesMetrics, metricSettings } =
    widget

  return newURLQuery({
    settings: JSON.stringify({ from, to, slug, ticker }),
    widgets: JSON.stringify([
      {
        widget: 'ChartWidget',
        metrics: shareMetrics(metrics),
        metricIndicators: shareIndicators(metricIndicators),
        axesMetrics: shareAxesMetrics(axesMetrics),
        combinedMetrics: shareCombinedMetrics(metrics),
        metricSettings: shareMetricSettings(metricSettings),
        colors,
      },
    ]),
  })
}
