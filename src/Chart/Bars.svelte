<svelte:options immutable />

<script lang="ts">
  import { plotBars } from 'san-chart/bars'
  import { getChart } from './context'
  const chart = getChart()

  chart.plotManager.set('bars', (chart, scale, data, colors, categories) => {
    plotBars(chart, data, categories.bars, scale, colors)
  })
</script>
