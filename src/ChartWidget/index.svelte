<script lang="ts">
  import { onDestroy } from 'svelte'
  import { studio } from '@/stores/studio'
  import { getTimeseries, getAllTimeData } from '@/api/timeseries'
  import { setIsTooltipSyncEnabled } from '@/Chart/Tooltip/context'
  import { getAdapterController } from '@/adapter/context'
  import Widget from './Widget.svelte'
  import { initWidget, getOnLoadContext } from './context'
  import { debounced } from './utils'
  import { getSharedAccessHeaders } from '@/api/timeseries/queries'

  const { isOnlyChartEmbedded, sharedAccessToken } = getAdapterController()

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
  const onData = (newData, newLoadings) => (rawData = newData) && (loadings = newLoadings)
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

  widget.fetchData = (cachePolicy) => fetchData(metrics, $studio, $MetricSettings, cachePolicy)

  let abortFetch
  const fetchData = debounced(
    (
      metrics: Studio.Metric[],
      settings: Studio.Settings,
      MetricSettings: Studio.MetricSettings,
      cachePolicy?: any,
    ) => {
      abortFetch?.()

      if (!cachePolicy && widget.defferedCachePolicy) {
        cachePolicy = widget.defferedCachePolicy
        delete widget.defferedCachePolicy
      }

      const requestOptions = sharedAccessToken && {
        headers: getSharedAccessHeaders(sharedAccessToken),
      }

      // prettier-ignore
      abortFetch = getTimeseries(
        metrics, settings, onData, onDataError, MetricSettings, cachePolicy, requestOptions 
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

  onDestroy(() => {
    abortFetch?.()
  })
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
