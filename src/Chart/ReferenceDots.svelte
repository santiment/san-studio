<svelte:options immutable />

<script lang="ts">
  import { drawReferenceDot } from 'san-chart/references'
  import { getChart } from './context'
  const chart = getChart()

  export let references = []

  $: references && chart.redraw()

  chart.plotManager.set('referenceDots', (chart, _, __, colors) => {
    references.forEach(({ key, metric, data, color = '#FF5B5B' }) => {
      const metricColor = colors[metric]
      console.log({ key, metric, data })
      if (!metricColor) return

      const refColor = metricColor.length < 8 ? color : color + '22'
      for (let i = data.length - 1; i > -1; i--) {
        drawReferenceDot(chart, metric, data[i].datetime, refColor, key, 3)
      }
    })
  })
</script>
