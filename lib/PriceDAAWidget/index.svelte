<script lang="ts">
  import { Metric } from './../metrics'
  import ChartWidget from './../ChartWidget/index.svelte'
  import { studio } from './../stores/studio'

  export let widget
  export let isSingleWidget: boolean
  export let deleteWidget
  export let metrics = [Metric.price_usd, Metric.price_daa_divergence]
  export let prefix = ''

  widget.metrics = metrics
  widget.isBlocked = true

  const metricsFilter = () => false
  const fullscreenMetricsFilter = metricsFilter
</script>

<ChartWidget {widget} {metricsFilter} {isSingleWidget} {deleteWidget} {fullscreenMetricsFilter}>
  <div class="row">
    {prefix} Price DAA Divergence ({$studio.ticker})
  </div>
</ChartWidget>
