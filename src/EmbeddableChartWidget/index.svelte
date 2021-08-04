<script lang="ts">
  import { newHistoryContext } from 'webkit/ui/history'
  import { setAdapterController } from '@/adapter/context'
  import { initWidget } from '@/ChartWidget/context'
  import Widget from '@/ChartWidget/Widget.svelte'
  import { mergeTimeseries } from '@/api/timeseries/utils'

  newHistoryContext({ add: () => {} })
  setAdapterController({
    noWidgetControls: true,
    isEmbedded: true,
  })

  let widget = {} as Studio.ChartWidget
  let rawData: any[] = []
  let MetricError = new Map()
  let loadings = new Set()

  initWidget(widget)

  const { Metrics, ChartColors } = widget

  window.addEventListener('message', (e) => {
    if (!e.data) return

    const { type, metrics, datetimeKey = 'datetime' } = e.data

    if (type === 'init') {
      let data: any[] = []

      Metrics.set(metrics)
      metrics.forEach((metric) => {
        const { key, color, node } = metric
        data = mergeTimeseries(
          data,
          normalizeData(key, metric.data, datetimeKey),
        )

        metric.noProject = true
        metric.getLabel = () => metric.label
        if (color) ChartColors.set(key, color)
        if (!node) metric.node = 'line'
      })
      rawData = data
    }
  })

  function normalizeData(
    metricKey: string,
    data: any[],
    datetimeKey = 'datetime',
  ) {
    if (data.length < 1) return []

    const valueKey = Object.keys(data[0]).find(
      (key) => key !== datetimeKey,
    ) as string
    return data.map((item) => ({
      datetime: +new Date(item[datetimeKey]),
      [metricKey]: item[valueKey],
    }))
  }
</script>

<Widget {widget} {rawData} {MetricError} {loadings} />
