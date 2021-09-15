<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { linearScale } from 'san-chart/scales'
  import { millify } from 'webkit/utils/formatting'
  import { getDateFormats, getTodaysEnd } from 'webkit/utils/dates'
  import { getChart } from '@/Chart/context'
  import { queryPriceHistogram } from '@/api/metrics/histogram'

  const chart = getChart()
  const ID = 'spent_coin_cost'

  export let slug
  export let isPro = false

  let buckets = []
  let price = 0

  $: from = getTodaysEnd()
  $: to = new Date(from)
  $: from.setDate(from.getDate() - 1)
  $: if (isPro === false) {
    from.setMonth(from.getMonth() - 1)
    to.setMonth(to.getMonth() - 1)
  }
  $: queryPriceHistogram(slug, from.toISOString(), to.toISOString()).then(
    (data) => {
      buckets = data.buckets
      price = data.price
    },
  )
  $: dateLabel = getDate(to)

  function getDate(date) {
    const { DD, MM, YY } = getDateFormats(date)
    return ` on ${DD}.${MM}.${YY}`
  }

  chart.plotManager.set(ID, (chart, scale) => {
    const { price_usd } = chart.minMaxes
    if (!price_usd) return

    const { min, max } = price_usd

    let start = 0
    let end = buckets.length - 1

    for (let i = 0; i < end; i++, start++) {
      if (buckets[i].range[1] > min) break
    }
    for (let i = end; i > start; i--, end--) {
      if (buckets[i].range[0] < max) break
    }

    if (start >= end) return

    let amountMin = Infinity
    let amountMax = -Infinity
    let priceIndex = start
    for (let i = start; i <= end; i++) {
      const { amount, range } = buckets[i]
      if (amountMin > amount) amountMin = amount
      if (amountMax < amount) amountMax = amount
      if (range[0] < price && price < range[1]) priceIndex = i
    }

    const scaler = linearScale({ height: 100, top: 0 }, amountMin, amountMax)
    const { ctx, right, bottom } = chart
    const bucketScaler = scale(chart, min, max)

    const points = new Array(end - start)

    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    for (let i = start, j = 0; i <= end; i++, j++) {
      const { range, amount } = buckets[i]
      const [min, max] = range

      const yMin = bucketScaler(min)
      const yMax = bucketScaler(max)
      const yEnd = yMin < bottom ? yMin - 1 : bottom

      const width = scaler(amount) - 100
      const height = yEnd - yMax

      ctx.fillStyle = i < priceIndex ? '#26C95339' : '#FF5B5B39'
      ctx.fillRect(right + 25, yMax, width, height)

      points[j] = [yMax, yMin, millify(amount, 2) + dateLabel]
    }

    ctx.restore()
    chart.modifyPoint = (point, x, y) => {
      for (let i = points.length - 1; i > -1; i--) {
        const [min, max, value] = points[i]
        if (y > min && y < max) {
          return Object.assign({ spentCoinCost: { value } }, point)
        }
      }
      return point
    }
  })

  onMount(() => {
    setTimeout(chart.redraw, 200) // TODO: rework [@vanguard | Sep 15, 2021]
  })

  onDestroy(() => {
    delete chart.modifyPoint
    chart.plotManager.delete(ID)
    chart.redraw()
  })
</script>
