<script lang="ts">
  import { track } from 'webkit/analytics'
  import { getSavedValue, saveValue } from 'webkit/utils/localStorage'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from './Dropdown.svelte'

  const widget = getWidget()
  const { MetricSettings } = widget
  const DEFAULT_MIN_MAX = { min: '', max: '' }
  const TIP = 'AXIS_MAX_MIN_TIP'

  export let metric: Studio.Metric

  let isOpened
  let isTipVisible = !getSavedValue(TIP)

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
      const metricKey = metric.key

      userMinMaxes[name] = value
      if (!value) return MetricSettings.delete(metricKey, name)

      track.event(Event.MetricAxisMaxMin, { metric: metricKey, type: name })
      MetricSettings.set(metricKey, { [name]: value })
    }, 300)
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Dropdown bind:isOpened>
  Axis max/min: {getLabel(axisMax)}/{getLabel(axisMin)}

  <svelte:fragment slot="options">
    {#if isTipVisible}
      <div class="tip caption mrg-s mrg--b">
        Example:
        <span class="example border">1234 </span>
        or
        <span class="example border">+5%</span>

        <div
          class="close btn"
          on:click={() => (saveValue(TIP, '+'), (isTipVisible = false))}>
          <Svg id="close" w="8" />
        </div>
      </div>
    {/if}

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
    position: relative;
  }

  .example {
    padding: 1px 3px;
  }

  .close {
    position: absolute;
    right: 8px;
    top: 5px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }
</style>
