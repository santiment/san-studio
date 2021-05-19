import type { Drawing } from '@/Chart/Drawer/context'
import type { MetricSettings } from '@/ChartWidget/MetricSettings/context'
import type { MetricIndicators } from '@/ChartWidget/MetricSettings/IndicatorSetting/context'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
import { newChartDisplayStore } from './chartMetricDisplay'
import { newChartDrawerStore } from '@/Chart/Drawer/context'
import { newChartAxesStore } from '@/Chart/Axes/context'
import { newChartColorsStore } from '@/Chart/colors/context'
import { newChartOptionsStore } from '@/ChartWidget/Controls/context'
import { newMetricsStore } from '@/ChartWidget/Metrics/context'
import { newMetricSettingsStore } from '@/ChartWidget/MetricSettings/context'
import { newMetricIndicatorsStore } from '@/ChartWidget/MetricSettings/IndicatorSetting/context'

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
  drawings?: Drawing[]
  metricSettings?: MetricSettings
  metricIndicators?: MetricIndicators
}

const CONTEXT = 'widget'
export const setWidget = (widget: ChartWidget): void =>
  setContext(CONTEXT, widget)
export const getWidget = (): ChartWidget => getContext(CONTEXT)

export function initWidget(widget: any) {
  setWidget(widget as ChartWidget)

  if (!widget.ChartAxes)
    widget.ChartAxes = newChartAxesStore(
      widget.axesMetrics,
      widget.disabledAxesMetrics,
    )
  if (!widget.ChartDrawer)
    widget.ChartDrawer = newChartDrawerStore(widget.drawings)
  if (!widget.ChartColors)
    widget.ChartColors = newChartColorsStore(widget.colors)
  if (!widget.ChartOptions) widget.ChartOptions = newChartOptionsStore()
  if (!widget.ChartMetricDisplays)
    widget.ChartMetricDisplays = newChartDisplayStore()
  if (!widget.Metrics) widget.Metrics = newMetricsStore(widget.metrics)
  if (!widget.MetricSettings)
    widget.MetricSettings = newMetricSettingsStore(widget.metricSettings)
  if (!widget.MetricIndicators)
    widget.MetricIndicators = newMetricIndicatorsStore(widget.metricIndicators)
  if (!widget.IsLoaded) widget.IsLoaded = writable(false)
}
