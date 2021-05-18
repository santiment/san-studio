<script lang="ts">
  import { plotAreas } from 'san-chart/areas'
  import { getChart } from './context'
  const chart = getChart()

  chart.plotManager.set('areas', (chart, scale, data, colors, { areas }) => {
    chart.ctx.lineWidth = 1.5
    plotAreas(chart, data, areas, scale, colors)
  })
</script>
