import type { CachePolicy } from 'san-webkit/lib/api/cache'
import type { MetricSettings } from '@/ChartWidget/MetricSettings/context'
import type { MetricIndicators } from '@/ChartWidget/MetricSettings/IndicatorSetting/context'
import { setContext, getContext } from 'svelte'
import { get, writable } from 'svelte/store'
import { newMetricSignalsStore, newSignalsTimeseriesStore } from './signals'
import { newMetricDisplayersStore } from './metricDisplayers'
import { newChartDrawerStore, setChartDrawer } from '@/Chart/Drawer/context'
import { newChartAxesStore, newPinnedChartAxesStore } from '@/Chart/Axes/context'
import { newChartColorsStore } from '@/Chart/colors/context'
import { newChartOptionsStore } from '@/ChartWidget/Controls/context'
import { newMetricsStore } from '@/ChartWidget/Metrics/context'
import { newMetricSettingsStore } from '@/ChartWidget/MetricSettings/context'
import { newMetricIndicatorsStore } from '@/ChartWidget/MetricSettings/IndicatorSetting/context'
import { newChartAddonsStore } from '@/ChartWidget/Addons/contex'

export type ChartWidget = {
  ChartAxes: ReturnType<typeof newChartAxesStore>
  ChartDrawer: ReturnType<typeof newChartDrawerStore>
  ChartColors: ReturnType<typeof newChartColorsStore>
  ChartOptions: ReturnType<typeof newChartOptionsStore>
  Metrics: ReturnType<typeof newMetricsStore>
  MetricSettings: ReturnType<typeof newMetricSettingsStore>
  MetricIndicators: ReturnType<typeof newMetricIndicatorsStore>
  axesMetrics?: Set<Studio.Metric>
  disabledAxesMetrics?: Set<Studio.Metric>
  drawings?: SAN.Charts.Drawing[]
  metricSettings?: MetricSettings
  metricIndicators?: MetricIndicators
  chart: any
  defferedCachePolicy?: CachePolicy
}

const CONTEXT = 'widget'
export const setWidget = (widget: ChartWidget) => setContext(CONTEXT, widget)
export const getWidget = (): ChartWidget => getContext(CONTEXT)

export function initWidget(widget: any) {
  if (!widget.ChartAxes)
    widget.ChartAxes = newChartAxesStore(widget.axesMetrics, widget.disabledAxesMetrics)
  if (!widget.PinnedChartAxes) widget.PinnedChartAxes = newPinnedChartAxesStore(widget.pinnedAxes)

  if (!widget.ChartDrawer) widget.ChartDrawer = newChartDrawerStore(widget.drawings)
  if (!widget.ChartColors) widget.ChartColors = newChartColorsStore(widget.colors)
  if (!widget.ChartOptions) widget.ChartOptions = newChartOptionsStore(widget)
  if (!widget.ChartMetricDisplays) widget.ChartMetricDisplays = newMetricDisplayersStore()
  if (!widget.Metrics) widget.Metrics = newMetricsStore(widget.metrics)
  if (!widget.MetricsSignals) widget.MetricsSignals = newMetricSignalsStore(widget.signalMetrics)
  if (!widget.SignalsTimeseries) widget.SignalsTimeseries = newSignalsTimeseriesStore()
  if (!widget.MetricSettings) widget.MetricSettings = newMetricSettingsStore(widget.metricSettings)
  if (!widget.MetricIndicators)
    widget.MetricIndicators = newMetricIndicatorsStore(widget.metricIndicators)
  if (!widget.ChartAddons) widget.ChartAddons = newChartAddonsStore(widget.chartAddons)

  if (!widget.IsLoaded) widget.IsLoaded = writable(false)
  if (!widget.OnUpdate) widget.OnUpdate = newOnUpdateStore(widget)
}

export function newOnUpdateStore(widget: any) {
  let i = 0
  const { subscribe, set } = writable(i)

  return {
    subscribe,
    emit() {
      widget.metrics = get(widget.Metrics)
      widget.metricIndicators = get(widget.MetricIndicators)
      widget.metricSettings = get(widget.MetricSettings)
      widget.drawings = (get(widget.ChartDrawer) as any).drawings
      widget.colors = get(widget.ChartColors)
      widget.axesMetrics = get(widget.ChartAxes)
      widget.pinnedAxes = get(widget.PinnedChartAxes)
      widget.signalMetrics = get(widget.MetricsSignals)

      widget.onWidgetUpdate?.()
      set(i++)
    },
  }
}

export function initWidgetContext(widget: any) {
  setWidget(widget as ChartWidget)
  setChartDrawer(widget.ChartDrawer)
}

const ON_LOAD_CONTEXT = 'ON_LOAD'
export const setOnLoadContext = (onLoad): void => setContext(ON_LOAD_CONTEXT, onLoad)
export const getOnLoadContext = (): any => getContext(ON_LOAD_CONTEXT)

const WIDGET_DATA_LOADED = 'WIDGET_DATA_LOADED'
export const dispatchWidgetDataLoaded = (widget) =>
  window.dispatchEvent(new CustomEvent(WIDGET_DATA_LOADED, { detail: widget }))

export const subscribeWidgetDataLoadedEvent = (clb) => {
  window.addEventListener(WIDGET_DATA_LOADED, clb)
  return () => window.removeEventListener(WIDGET_DATA_LOADED, clb)
}
