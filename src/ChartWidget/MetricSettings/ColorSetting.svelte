<script lang="ts">
  import { track } from 'webkit/analytics'
  import { withScroll, getHistoryContext } from '@/history'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from './Dropdown.svelte'
  import ColorPicker from './ColorPicker/index.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { ChartColors } = widget

  export let metric: Studio.Metric

  let timer

  $: color = $ChartColors[metric.key]

  function onChange(value) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      const oldColor = color
      const redo = () => setColor(value)
      track.event(Event.MetricColor, { metric: metric.key, color: value })

      redo()
      History.add(
        'Color change',
        withScroll(widget, () => setColor(oldColor)),
        withScroll(widget, redo),
      )
    }, 150)
  }

  function setColor(value: string) {
    color = value
    ChartColors.set(metric.key, value)
  }
</script>

<Dropdown isList={false}>
  <div class="color" style="--color:{color}" />

  <svelte:fragment slot="options">
    {#if color}
      <ColorPicker {color} {onChange} />
    {/if}
  </svelte:fragment>
</Dropdown>

<style>
  div {
    background: var(--color);
    border-radius: 2px;
    width: 10px;
    height: 10px;
  }
</style>
