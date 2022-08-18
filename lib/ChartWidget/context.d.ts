import type { CachePolicy } from 'san-webkit/lib/api/cache'
import type { MetricSettings } from './../../lib/ChartWidget/MetricSettings/context'
import type { MetricIndicators } from './../../lib/ChartWidget/MetricSettings/IndicatorSetting/context'
import { newChartDrawerStore } from './../../lib/Chart/Drawer/context'
import { newChartAxesStore } from './../../lib/Chart/Axes/context'
import { newChartColorsStore } from './../../lib/Chart/colors/context'
import { newChartOptionsStore } from './../../lib/ChartWidget/Controls/context'
import { newMetricsStore, newHiddenMetricsStore } from './../../lib/ChartWidget/Metrics/context'
import { newMetricSettingsStore } from './../../lib/ChartWidget/MetricSettings/context'
import { newMetricIndicatorsStore } from './../../lib/ChartWidget/MetricSettings/IndicatorSetting/context'
export declare type ChartWidget = {
  ChartAxes: ReturnType<typeof newChartAxesStore>
  ChartDrawer: ReturnType<typeof newChartDrawerStore>
  ChartColors: ReturnType<typeof newChartColorsStore>
  ChartOptions: ReturnType<typeof newChartOptionsStore>
  Metrics: ReturnType<typeof newMetricsStore>
  HiddenMetrics: ReturnType<typeof newHiddenMetricsStore>
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
export declare const setWidget: (widget: ChartWidget) => ChartWidget
export declare const getWidget: () => ChartWidget
export declare function initWidget(widget: any): void
export declare function newOnUpdateStore(widget: any): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<number>,
    invalidate?: ((value?: number | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  emit(): void
}
export declare function initWidgetContext(widget: any): void
export declare const setOnLoadContext: (onLoad: any) => void
export declare const getOnLoadContext: () => any
export declare const dispatchWidgetDataLoaded: (widget: any) => boolean
export declare const subscribeWidgetDataLoadedEvent: (clb: any) => () => void
