<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from './Dropdown.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget
  const DEFAULT_MIN_MAX = { min: '', max: '' }

  export let metric: Studio.Metric

  let isOpened

  $: metricSettings = MetricSettings.getMetricSettings(metric.key)
  $: minMaxes =
    (isOpened && widget.defaultMinMaxes[metric.key]) || DEFAULT_MIN_MAX
  $: userMinMaxes = metricSettings || {}
  $: ({ axisMin = '', axisMax = '' } = userMinMaxes)

  const getLabel = (value: string | number) => value.toString() || 'Auto'

  let timer
  function onChange({ target: { name, value } }) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      userMinMaxes[name] = value
      if (!value) return MetricSettings.delete(metric.key, name)

      MetricSettings.set(metric.key, { [name]: value })
    }, 300)
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Dropdown bind:isOpened>
  Axis max/min: {getLabel(axisMax)}/{getLabel(axisMin)}

  <svelte:fragment slot="options">
    <div class="tip caption mrg-s mrg--b">
      Example:
      <span class="example border">1234 </span>
      or
      <span class="example border">+5%</span>
    </div>

    <div class="row v-center">
      Max:
      <input
        class="border"
        autofocus
        on:input={onChange}
        name="axisMax"
        value={axisMax.toString()}
        placeholder="Auto ({Math.floor(minMaxes.max)})" />
    </div>

    <div class="row mrg-s mrg--t v-center justify">
      Min:
      <input
        class="border"
        on:input={onChange}
        name="axisMin"
        value={axisMin.toString()}
        placeholder="Auto ({Math.floor(minMaxes.min)})" />
    </div>
  </svelte:fragment>
</Dropdown>

<style>
  input {
    padding: 5px 8px;
    margin-left: 8px;
  }

  .tip {
    padding: 5px;
    background: var(--green-light-1);
  }

  .example {
    padding: 1px 3px;
  }
</style>
