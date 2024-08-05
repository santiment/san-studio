<script lang="ts">
  import { onDestroy } from 'svelte'
  import { linearScale } from '@santiment-network/chart/scales'
  import { millify } from 'san-webkit/lib/utils/formatting'
  import { getDateFormats } from 'san-webkit/lib/utils/dates'
  import { getChart } from './../../Chart/context'
  import { getWidget } from './../../ChartWidget/context'
  import { queryPriceHistogram } from './../../api/metrics/histogram'
  import { getCoinCostDate, checkAreSameDay } from './utils'

  const widget = getWidget()
  const chart = getChart()
  const ID = 'spent_coin_cost'
  const WIDTH = 150
  const { MetricSettings } = widget

  export let addon
  export let slug
  export let isPro = false

  let buckets = []
  let price = 0

  $: metricSettings = $MetricSettings[addon.key]
  $: [from, to] = getCoinCostDate(metricSettings, isPro)
  $: queryPriceHistogram(slug, from.toISOString(), to.toISOString()).then((data) => {
    buckets = data.buckets
    price = data.price
    chart.redraw()

    if (data.buckets.length === 0) {
      widget.setChartAddonError(addon, 'No data for this date')
    } else {
      widget.deleteChartAddonError(addon)
    }
  })
  $: dateLabel = getLabel(from, to)

  function formatDate(date) {
    const { DD, MMM, YY } = getDateFormats(date)
    return `${MMM} ${DD}, ${YY}`
  }
  function getLabel(from, to) {
    const toLabel = formatDate(to)
    if (checkAreSameDay(from, to)) {
      return ` on ${toLabel}`
    }

    return ` on ${formatDate(from)} - ${toLabel}`
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

    const scaler = linearScale({ height: WIDTH, top: 0 }, amountMin, amountMax)
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

      const width = scaler(amount) - WIDTH
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

  onDestroy(() => {
    delete chart.modifyPoint
    chart.plotManager.delete(ID)
    chart.redraw()
  })
</script>
