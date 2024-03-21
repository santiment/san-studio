<svelte:options immutable />

<script lang="ts">
  import { getChart } from './context'
  import { ONE_DAY_IN_MS } from 'san-webkit/lib/utils/dates'
  const chart = getChart()

  export let references = []

  $: references && chart.redraw()

  chart.plotManager.set('trendingDots', (chart, _, data) => {
    const { ctx, points } = chart
    references.forEach((metric: any) => {
      const key = metric.key
      const target = metric.project
        ? metric.key.replace(metric.base.key, metric.references)
        : metric.references

      let lastDate = 0

      for (let i = 0; i < data.length - 1; i++) {
        const item = data[i]
        const value = item[key]
        if (!value) continue

        const point = points[i]

        const targetPoint = point[target]
        if (!targetPoint) continue

        if (item.datetime - lastDate > ONE_DAY_IN_MS) {
          lastDate = item.datetime

          ctx.beginPath()
          ctx.arc(point.x, targetPoint.y - 2, 4, 0, Math.PI * 2)
          ctx.lineWidth = 1
          ctx.strokeStyle = '#9FAAC4'
          ctx.stroke()
          ctx.fillStyle = metric.getColor(value) ?? 'red' //fillColor
          ctx.fill()
        }

        point[key] = {
          y: data.y,
          value,
        }
      }
      // drawTrendingDot(chart, metric.target, )
    })
  })
</script>
