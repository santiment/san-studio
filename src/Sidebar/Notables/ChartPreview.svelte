<script lang="ts">
  import Chart from '@/Chart/index.svelte'
  import Areas from '@/Chart/Areas.svelte'
  import ReferenceDots from '@/Chart/ReferenceDots.svelte'
  import { getTimeseries } from '@/api/timeseries'

  export let metric
  export let settings
  export let signals

  const onData = (newData) => (data = newData)
  const padding = { top: 10, left: 0, bottom: 0, right: 0 }

  let data = []

  $: metrics = [metric]
  $: getTimeseries(metrics, settings, onData, () => {})
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
</script>

<Chart {data} {categories} {colors} {padding}>
  <Areas />
  <ReferenceDots {references} />
</Chart>

<style>
</style>
