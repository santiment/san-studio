<script lang="ts">
  import { newHistoryContext } from 'san-webkit/lib/ui/history'
  import { setAdapterController } from './../../lib/adapter/context'
  import { initWidget } from './../../lib/ChartWidget/context'
  import Widget from './../../lib/ChartWidget/Widget.svelte'
  import { mergeTimeseries } from './../../lib/api/timeseries/utils'
  newHistoryContext({
    add: () => {},
  })
  setAdapterController({
    noWidgetControls: true,
    isEmbedded: true,
  })
  let widget = {}
  let rawData = []
  let MetricError = new Map()
  let loadings = new Set()
  initWidget(widget)
  const { Metrics, ChartColors } = widget
  window.addEventListener('message', (e) => {
    if (!e.data) return
    const { type, metrics, datetimeKey = 'datetime' } = e.data

    if (type === 'init') {
      let data = []
      Metrics.set(metrics)
      metrics.forEach((metric) => {
        const { key, color, node } = metric
        data = mergeTimeseries(data, normalizeData(key, metric.data, datetimeKey))
        metric.noProject = true

        metric.getLabel = () => metric.label

        if (color) ChartColors.set(key, color)
        if (!node) metric.node = 'line'
      })
      rawData = data
    }
  })

  function normalizeData(metricKey, data, datetimeKey = 'datetime') {
    if (data.length < 1) return []
    const valueKey = Object.keys(data[0]).find((key) => key !== datetimeKey)
    return data.map((item) => ({
      datetime: Date.parse(item[datetimeKey]),
      [metricKey]: item[valueKey],
    }))
  }
</script>

<Widget {widget} {rawData} {MetricError} {loadings} />
