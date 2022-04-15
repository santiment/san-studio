import { get } from 'svelte/store'
import { shareChartAddons } from './addons'
import { shareDrawings } from './drawings'
import {
  newMetricAlias,
  shareAxesMetrics,
  shareColors,
  shareMetricSettings,
  shareCombinedMetrics,
} from './index'
import { shareMetrics } from './metrics'

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

  return subwidgets.map(({ key, from, to }) => ({
    k: key,
    f: from,
    t: to,
  }))
}

function shareSignalMetrics(signalMetrics, accessor): string[] {
  return (signalMetrics || []).map(accessor)
}

export function shareWidget(widget) {
  const { metrics, axesMetrics, colors, metricSettings } = widget
  const { drawings, signalMetrics, subwidgets, holderLabels, ChartAddons } = widget

  const keys = shareMetrics(metrics)
  const metricAlias = newMetricAlias(keys)
  const keyAccessor = ({ key }) => metricAlias[key]

  const shared = {
    // widget metrics
    wm: keys,
    // widget axes
    wax: shareAxesMetrics(axesMetrics, keyAccessor),
    // widget colors
    wc: shareColors(colors, metricAlias),
    // widget settings
    ws: nullifyMetricSettings(shareMetricSettings(metricSettings, metricAlias)),
    // widget combined metrics
    wcm: nullify(shareCombinedMetrics(metrics)),
    // widget drawings
    wd: nullify(shareDrawings(drawings)),

    // widget signal metrics
    wsm: shareSignalMetrics(signalMetrics, keyAccessor),

    // widget holder labels
    whl: nullify(holderLabels),

    // chart addons
    wcad: ChartAddons && shareChartAddons(get(ChartAddons)),

    // connected subwidgets
    wcsb: shareSubwidgets(subwidgets),
  }

  return shared
}
