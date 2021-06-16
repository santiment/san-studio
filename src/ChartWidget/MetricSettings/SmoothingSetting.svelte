<script lang="ts">
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from './Dropdown.svelte'
  import { setWeightedSocialSmoothing } from '../transformers/weightedSocial'
  const { MetricSettings } = getWidget()

  export let metric: Studio.Metric

  $: metricSettings = MetricSettings.getMetricSettings(metric.key)
  $: smoothing = metricSettings?.smoothing || 0
  $: hasSmoothing = smoothing > 1

  let timer
  function onChange({ target: { value } }) {
    smoothing = +value

    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      metricSettings.smoothing = hasSmoothing ? smoothing : 0
      setWeightedSocialSmoothing(metric.key, metricSettings)
      MetricSettings.set(metric.key, metricSettings)
    }, 150)
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Dropdown>
  Smoothing: {hasSmoothing ? smoothing : 'Off'}

  <svelte:fragment slot="options">
    <input
      autofocus
      type="range"
      min="1"
      max="21"
      value={smoothing}
      on:input={onChange} />
  </svelte:fragment>
</Dropdown>
