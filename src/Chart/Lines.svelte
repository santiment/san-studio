<script lang="ts">
  import { plotLines, plotFilledLines, plotGradientLine } from 'san-chart/lines'
  import { getChart } from './context'
  const chart = getChart()

  chart.plotManager.set('lines', (chart, scale, data, colors, categories) => {
    const { lines, filledLines, gradientLines } = categories
    chart.ctx.lineWidth = 1.5
    plotLines(chart, data, lines, scale, colors)
    plotFilledLines(chart, data, filledLines, scale, colors)
    plotGradientLine(chart, data, gradientLines, scale, colors)
  })
</script>
