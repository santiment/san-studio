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
import {
  parse,
  parseArray,
  parseMetrics,
  parseCombinedMetrics,
  parseIndicators,
  parseMergedMetrics,
  parseMetricGraphValue,
  parseAxesMetrics,
} from '@/sharing/parse'

const stringify = (v: any) => JSON.stringify(v)

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
    ws: shareMetricSettings(metricSettings, metricAlias).map(stringify),
    // widget indicators
    win: shareIndicators(metricIndicators, metricAlias).map(stringify),
    // widget combined metrics
    wcm: shareCombinedMetrics(metrics).map(stringify),
  })

  return qs
}

const parseJSON = (value: any) => value && JSON.parse(value)

export function parseQueryString(qs: string) {
  const shared = parse(qs) as any
  const { ps, pt, df, dt, emnm, emcg, emms } = shared
  const { wm, wax, wc, ws, win, wcm } = shared

  const KnownMetric = {}
  const sharedMetrics = parseArray(wm)

  parseCombinedMetrics(parseArray(wcm).map(parseJSON), KnownMetric)
  const metricIndicators = parseIndicators(
    parseArray(win).map(parseJSON),
    sharedMetrics,
    KnownMetric,
  )
  const mergedMetrics = parseMergedMetrics(sharedMetrics, KnownMetric)

  const parsed = {
    slug: ps,
    ticker: pt,

    from: df,
    to: dt,

    isNightMode: emnm ? true : false,
    isCartesianGrid: emcg ? true : false,
    isWithMetricSettings: emms ? true : false,

    metrics: parseMetrics(sharedMetrics, KnownMetric),
    metricIndicators,
    mergedMetrics,

    metricSettings: parseMetricGraphValue(
      parseArray(ws).map(parseJSON),
      sharedMetrics,
      KnownMetric,
    ),
    colors: parseMetricGraphValue(parseArray(wc), sharedMetrics, KnownMetric),
  }
  Object.assign(
    parsed,
    parseAxesMetrics(parseArray(wax), sharedMetrics, KnownMetric),
  )

  return parsed
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
