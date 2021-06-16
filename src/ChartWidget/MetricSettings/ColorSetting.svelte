<script lang="ts">
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import Setting from './Setting.svelte'
  import Dropdown from './Dropdown.svelte'
  import ColorPicker from './ColorPicker.svelte'
  import { getWidget } from '@/ChartWidget/context'
  import { Event } from '@/analytics'

  const { ChartColors } = getWidget()

  export let metric: Studio.Metric

  let node
  let timer

  $: color = $ChartColors[metric.key]

  function onChange(value) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      color = value
      ChartColors.set(metric.key, value)
      track.event(Event.MetricColor, { metric: metric.key, color: value })
    }, 150)
  }
</script>

<Dropdown isList={false}>
  <div class="color" style="--color:{color}" />

  <svelte:fragment slot="options">
    <ColorPicker {color} {onChange} />
  </svelte:fragment>
</Dropdown>

<style>
  input {
    visibility: hidden;
    width: 0;
    height: 0;
    padding: 0;
    border: 0;
  }

  div {
    background: var(--color);
    border-radius: 2px;
    width: 10px;
    height: 10px;
  }
</style>
