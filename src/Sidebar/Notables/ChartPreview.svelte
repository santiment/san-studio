<script lang="ts">
  import Chart from '@/Chart/index.svelte'
  import Areas from '@/Chart/Areas.svelte'
  import ReferenceDots from '@/Chart/ReferenceDots.svelte'
  import { getTimeseries } from '@/api/timeseries'
  import { querySignalTimeseries } from '@/api/signals'

  export let key
  export let metric
  export let settings
  export let signals = []

  const onData = (newData) => (data = newData)
  const padding = { top: 10, left: 10, bottom: 10, right: 10 }

  let data = []

  $: metrics = [metric]
  $: getTimeseries(metrics, settings, onData, () => {})
  $: querySignalTimeseries(key, settings).then(onSignalsData)

  $: categories = {
    joinedCategories: [metric.key],
    areas: [metric.key],
  }

  $: colors = {
    [metric.key]: '#D2D6E7',
  }

  $: references = [
    {
      metric: metric.key,
      data: signals,
    },
  ]

  function onSignalsData(signals) {
    references[0].data = signals
  }
</script>

<Chart {data} {categories} {colors} {padding}>
  <Areas />
  <ReferenceDots {references} />
</Chart>

<style>
</style>
