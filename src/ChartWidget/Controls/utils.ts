import type { Metric } from '@/sharing'
import {
  newURLQuery,
  newMetricAlias,
  shareMetrics,
  shareAxesMetrics,
  shareColors,
  shareMetricSettings,
  shareIndicators,
  shareCombinedMetrics,
} from '@/sharing'

export function shareEmbeded(widget, studio, options) {
  const { slug, ticker, from, to } = studio
  const { isNightMode, isWithMetricSettings, isCartesianGrid } = options
  const { metrics, axesMetrics, colors, metricSettings, metricIndicators } =
    widget

  const keys = shareMetrics(metrics)
  const metricAlias = newMetricAlias(keys)

  const keyAccessor = ({ key }: Metric) => metricAlias[key]

  const qs = newURLQuery({
    // project slug
    ps: slug,
    // project ticker
    pt: ticker,

    // date from
    df: from,
    // date to
    dt: to,

    // embedded night mode
    emnm: isNightMode ? 1 : undefined,
    // embedded cartesian grid
    emcg: isCartesianGrid ? 1 : undefined,
    // embedded metric settings row
    emms: isWithMetricSettings ? 1 : undefined,

    // widget metrics
    wm: keys,
    // widget axes
    wax: shareAxesMetrics(axesMetrics, keyAccessor),
    // widget colors
    wc: shareColors(colors, metricAlias),
    // widget settings
    ws: shareMetricSettings(metricSettings, metricAlias).map(JSON.stringify),
    // widget indicators
    win: shareIndicators(metricIndicators, metricAlias).map(JSON.stringify),
    // widget combined metrics
    wcm: shareCombinedMetrics(metrics).map(JSON.stringify),
  })

  console.log(keys, metricAlias, qs, decodeURIComponent(qs))

  return qs
}

export function getChartWidgetLabel(widget, studio): string {
  const { ticker } = studio
  return widget.metrics
    .map(({ label, getLabel, project }) => {
      if (project) return label
      return getLabel ? getLabel(ticker) : `${label} (${ticker})`
    })
    .join(', ')
}
