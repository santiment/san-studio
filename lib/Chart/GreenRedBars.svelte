<svelte:options immutable />

<script lang="ts">
  import { plotGreenRedBars } from '@santiment-network/chart/bars/greenRedBars'
  import { getChart } from './context'
  const chart = getChart()
  chart.plotManager.set('greenRedBars', (chart, scale, data, colors, categories) => {
    plotGreenRedBars(chart, data, categories.greenRedBars, scale, colors)
  })
</script>
