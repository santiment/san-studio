<script lang="ts">
  import { plotGreenRedBars } from 'san-chart/bars/greenRedBars'
  import { getChart } from './context'
  const chart = getChart()

  chart.plotManager.set('greenRedBars', (chart, scale, data, _, categories) => {
    plotGreenRedBars(chart, data, categories.greenRedBars, scale)
  })
</script>
