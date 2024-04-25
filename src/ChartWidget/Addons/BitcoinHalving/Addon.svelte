<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { getChart } from '@/Chart/context'
  import { HALVING_DATES } from './dates'
  import Pic from './Pic.svelte'
  import { getDateFormats } from 'san-webkit/lib/utils/dates'

  const chart = getChart()
  const ID = 'btc_halving'

  let items = [] as { left: number; date: string }[]
  let bottom = 0

  chart.plotManager.set(ID, (chart, scale) => {
    bottom = chart.padding.bottom

    const firstPoint = chart.points[0]
    if (!firstPoint) {
      items = []
      return
    }

    const firstDate = firstPoint.value
    const lastDate = chart.points[chart.points.length - 1]?.value
    if (!lastDate) {
      items = []
      return
    }

    const dates = HALVING_DATES.filter((date) => +date > firstDate && +date < lastDate)
    const yFactor = chart.width / (lastDate - firstDate)
    const scaler = (value: number): number => (lastDate - value) * yFactor

    items = dates.map((item) => {
      const { DD, MMM, YY } = getDateFormats(item)
      return {
        date: `${DD} ${MMM}, ${YY}`,
        left: chart.width - scaler(+item),
      }
    })
  })

  onMount(() => {
    chart.redraw()
  })

  onDestroy(() => {
    chart.plotManager.delete(ID)
  })
</script>

{#each items as item}
  <div
    class="expl-tooltip"
    style="bottom:{bottom}px;left:{item.left}px"
    aria-label="BTC Halving: {item.date}"
  >
    <Pic />
  </div>
{/each}

<style>
  div {
    position: absolute;
    transform: translateX(-50%);
    --expl-left: -70px;
  }
</style>
