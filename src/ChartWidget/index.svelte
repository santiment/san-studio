<script lang="ts">
  import { studio } from '@/stores/studio'
  import { getTimeseries, getAllTimeData } from '@/api/timeseries'
  import { setIsTooltipSyncEnabled } from '@/Chart/Tooltip/context'
  import { getAdapterController } from '@/adapter/context'
  import Widget from './Widget.svelte'
  import { initWidget, getOnLoadContext } from './context'
  import {
    groupDomains,
    getIndicatorDomainGroups,
    checkHasDomainGroups,
  } from './domain'
  import { debounced } from './utils'

  const { isOnlyChartEmbedded } = getAdapterController()

  let className = ''
  export { className as class }
  export let widget: Studio.ChartWidget
  export let isFullscreen = false
  export let isSingleWidget: boolean
  export let deleteWidget = undefined
  export let metricsFilter = undefined
  export let fullscreenMetricsFilter = undefined
  export let onLoad = getOnLoadContext()

  initWidget(widget)
  setIsTooltipSyncEnabled(!isFullscreen)

  const { Metrics, MetricSettings } = widget
  const onData = (newData, newLoadings) =>
    (rawData = newData) && (loadings = newLoadings)
  const onAllTimeData = (newData) => (allTimeData = newData)
  const noop = () => {}

  let rawData = []
  let allTimeData = isOnlyChartEmbedded ? undefined : []
  let MetricError = new Map()
  let loadings = new Set(widget.metrics)

  $: metrics = $Metrics
  $: ({ slug } = $studio)
  $: fetchData(metrics, $studio, $MetricSettings)
  $: isOnlyChartEmbedded !== true && fetchAllData(metrics, slug)

  widget.fetchData = (cachePolicy) =>
    fetchData(metrics, $studio, $MetricSettings, cachePolicy)

  let abortFetch
  const fetchData = debounced(
    (
      metrics: Studio.Metric[],
      settings: Studio.Settings,
      MetricSettings: Studio.MetricSettings,
      cachePolicy?: any,
    ) => {
      if (abortFetch) abortFetch()

      // prettier-ignore
      abortFetch = getTimeseries(
        metrics, settings, onData, onDataError, MetricSettings, cachePolicy
      )
    },
  )
  const fetchAllData = debounced((metrics: Studio.Metric[], slug: string) =>
    getAllTimeData(metrics, slug, onAllTimeData, noop),
  )

  function onDataError(Error, newLoadings, newData?: any) {
    MetricError = Error
    loadings = newLoadings
    if (newData) rawData = newData
  }
</script>

<Widget
  {widget}
  {rawData}
  {allTimeData}
  {MetricError}
  {loadings}
  {isSingleWidget}
  {isFullscreen}
  {deleteWidget}
  {metricsFilter}
  {fullscreenMetricsFilter}
  {onLoad}
  class={className} />
