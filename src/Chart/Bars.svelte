<script lang="ts">
  import { plotBars, plotAutoWidthBars } from 'san-chart/bars'
  import { getChart } from './context'
  const chart = getChart()

  chart.plotManager.set('bars', (chart, scale, data, colors, categories) => {
    const { bars, autoWidthBars } = categories
    plotAutoWidthBars(chart, data, autoWidthBars, scale, colors)
    plotBars(chart, data, bars, scale, colors)
  })
</script>
