import { get } from 'svelte/store'
import { parseChartAddons, shareChartAddons } from './addons'
import { parseDrawings, shareDrawings } from './drawings'
import {
  newMetricAlias,
  shareAxesMetrics,
  shareColors,
  shareMetricSettings,
  shareCombinedMetrics,
} from './index'
import { shareMetrics } from './metrics'
import {
  parseAxesMetrics,
  parseCombinedMetrics,
  parseIndicators,
  parseMergedMetrics,
  parseMetricGraphValue,
  parseMetrics,
  parsePinnedAxesMetrics,
} from './parse'

function nullify(value: any) {
  if (Array.isArray(value) && value.length === 0) return undefined
  return value || undefined
}

function nullifyMetricSettings(sharedSettings: (undefined | { [settingKey: string]: any })[]) {
  let hasValues = false
  const result = {}
  sharedSettings.forEach((settings, key) => {
    if (!settings) return
    hasValues = true
    result[key] = settings
  })

  return hasValues ? result : undefined
}

function shareSubwidgets(subwidgets) {
  if (subwidgets.length === 0) return

  return subwidgets.filter(Boolean).map(({ key, from, to }) => ({
    k: key,
    f: from,
    t: to,
  }))
}

function shareSignalMetrics(signalMetrics, accessor): string[] {
  return (signalMetrics || []).map(accessor)
}

export function shareWidget(widget) {
  const { metrics, hiddenMetrics = [], axesMetrics, pinnedAxes, colors, metricSettings } = widget
  const { drawings, signalMetrics, subwidgets, holderLabels, ChartAddons } = widget
  const { isSharedAxisEnabled } = widget

  const keys = shareMetrics(metrics)
  const metricAlias = newMetricAlias(keys)
  const keyAccessor = ({ key }) => metricAlias[key]

  const shared = {
    // widget metrics
    wm: keys,
    // widget hidden metrics
    whm: shareMetrics(Array.from(hiddenMetrics)),
    // widget axes
    wax: shareAxesMetrics(axesMetrics, keyAccessor),
    // widget pinned axes
    wpax: shareAxesMetrics(pinnedAxes, keyAccessor),
    // widget colors
    wc: shareColors(colors, metricAlias),
    // widget settings
    ws: nullifyMetricSettings(shareMetricSettings(metricSettings, metricAlias)),
    // widget combined metrics
    wcm: nullify(shareCombinedMetrics(metrics)),
    // widget drawings
    wd: nullify(shareDrawings(drawings)),

    // widget signal metrics
    wsm: nullify(shareSignalMetrics(signalMetrics, keyAccessor)),

    // widget holder labels
    whl: nullify(holderLabels),

    // chart addons
    wcadon: ChartAddons && shareChartAddons(get(ChartAddons)),

    // connected subwidgets
    wcsb: shareSubwidgets(subwidgets),

    wcsa: isSharedAxisEnabled ? 1 : undefined,
  }

  return shared
}

export function parseMetricSettings(settings, metrics) {
  const result = {}
  Object.keys(settings || {}).forEach((alias) => {
    const metric = metrics[alias]
    if (metric) result[metric.key] = settings[alias]
  })
  return result
}

function parseSignalMetrics(signals, metrics) {
  return (signals || []).map((alias) => metrics[alias])
}

type ParseCtx = {
  parseSubwidgets: (any) => any
}
export function parseWidget(shared, ctx?: ParseCtx) {
  const { wm, whm, wax, wpax, wc, ws, wcm, wd, wsm, whl, wcadon, wcsb } = shared
  const { wcsa } = shared

  const KnownMetric = {}
  parseCombinedMetrics(wcm, KnownMetric)

  const metrics = parseMetrics(wm, KnownMetric)
  const metricIndicators = parseIndicators(metrics)
  const mergedMetrics = parseMergedMetrics(metrics)

  const parsed = {
    metrics,
    hiddenMetrics: parseMetrics(whm, KnownMetric),
    metricIndicators,
    mergedMetrics,

    metricSettings: parseMetricSettings(ws, metrics),
    colors: parseMetricGraphValue(wc, metrics),
    drawings: parseDrawings(wd),

    pinnedAxes: parsePinnedAxesMetrics(wpax, metrics),

    signalMetrics: parseSignalMetrics(wsm, metrics),
    holderLabels: whl,

    isSharedAxisEnabled: !!wcsa,

    chartAddons: parseChartAddons(wcadon),
  }
  Object.assign(parsed, parseAxesMetrics(wax, metrics))
  Object.assign(parsed, ctx?.parseSubwidgets(wcsb))

  normalizeWidget(parsed)

  return parsed
}

function normalizeWidgetArray(widget, key) {
  widget[key] = (widget[key] || []).filter(Boolean)
}

function normalizeWidget(widget) {
  normalizeWidgetArray(widget, 'subwidgets')
  normalizeWidgetArray(widget, 'metrics')
  normalizeWidgetArray(widget, 'drawings')
}
