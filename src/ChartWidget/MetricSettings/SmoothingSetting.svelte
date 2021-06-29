<script lang="ts">
  import { withScroll, getHistoryContext } from '@/history'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from './Dropdown.svelte'
  import { setWeightedSocialSmoothing } from '../transformers/weightedSocial'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  $: metricSettings = MetricSettings.getMetricSettings(metric.key)
  $: smoothing = getSmoothing(metricSettings)
  $: hasSmoothing = smoothing > 1

  let timer
  function onChange({ target: { value } }) {
    smoothing = +value

    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      const oldSmoothing = getSmoothing(metricSettings)
      const newSmoothing = hasSmoothing ? smoothing : 0
      const redo = () => setSmoothing(newSmoothing)

      redo()
      History.add(
        'Smoothing change',
        withScroll(widget, () => setSmoothing(oldSmoothing)),
        withScroll(widget, redo),
      )
    }, 150)
  }

  function setSmoothing(newSmoothing: number) {
    metricSettings.smoothing = newSmoothing
    setWeightedSocialSmoothing(metric.key, metricSettings)
    MetricSettings.set(metric.key, metricSettings)
  }

  function getSmoothing(metricSettings) {
    return metricSettings?.smoothing || 0
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
