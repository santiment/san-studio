<script lang="ts">
  import { getTimeseries } from '@/api/timeseries'
  import { querySignalTimeseries } from '@/api/signals'
  import Chart from '@/Chart/index.svelte'
  import Areas from '@/Chart/Areas.svelte'
  import ReferenceDots from '@/Chart/ReferenceDots.svelte'

  export let key
  export let metric
  export let settings
  export let signals = []

  const onData = (newData) => (data = newData)
  const padding = { top: 10, left: 10, bottom: 10, right: 10 }

  let data = []
  let loading = false

  $: metrics = [metric]
  $: getTimeseries(metrics, settings, onData, () => {})
  $: getSignals(key, settings)
  $: colors = { [metric.key]: '#D2D6E7' }
  $: references = [{ metric: metric.key, data: signals }]
  $: categories = {
    joinedCategories: [metric.key],
    areas: [metric.key],
  }

  function getSignals(key, settings) {
    loading = true
    querySignalTimeseries(key, settings).then((data) => onSignalsData(key, data))
  }

  function onSignalsData(fetchedKey: string, signals: any[]) {
    if (fetchedKey !== key) return

    loading = false
    references[0].data = signals
  }
</script>

<Chart {data} {categories} {colors} {padding}>
  <Areas />
  <ReferenceDots {references} />
  {#if loading} <div class="loader" /> {/if}
</Chart>

<style>
  .loader {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 6px;
    border-top: 4px solid var(--mystic);
    border-right: 4px solid var(--mystic);
    border-bottom: 4px solid var(--mystic);
    border-left: 4px solid var(--casper);
    animation: loading 1.1s infinite linear;
    position: absolute;
    top: 30%;
    left: 48%;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
