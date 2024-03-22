<svelte:options immutable />

<script lang="ts">
  import { getContext } from 'svelte'
  import { getChart } from './context'

  const chart = getChart()

  export let references = []

  const dataCtx = getContext('dataCtx')

  $: references && chart.redraw()

  chart.plotManager.set('trendingDots', (chart, _, data, colors) => {
    const { ctx, points } = chart

    references.forEach((metric: any) => {
      const key = metric.key
      const target = metric.project
        ? metric.key.replace(metric.base.key, metric.references)
        : metric.references

      const alpha = colors[target]?.length < 8 ? '' : '22'

      for (let i = 0; i < data.length - 1; i++) {
        const item = data[i]
        const value = item[key]
        if (!value) continue

        const point = points[i]

        const targetPoint = point[target]
        if (!targetPoint) continue

        if (dataCtx.rawData[i]?.[key]) {
          ctx.beginPath()
          ctx.arc(point.x, targetPoint.y - 2, 4, 0, Math.PI * 2)
          ctx.fillStyle = metric.getColor(value) + alpha
          ctx.fill()

          ctx.lineWidth = 1
          ctx.strokeStyle = '#9FAAC4' + alpha
          ctx.stroke()
        }

        point[key] = {
          y: data.y,
          value,
        }
      }
    })
  })
</script>
