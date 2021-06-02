<script lang="ts">
  import { track } from 'webkit/analytics'
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import Setting from './Setting.svelte'
  const { ChartAxes } = getWidget()

  export let metric: Studio.Metric

  $: isDisabled = $ChartAxes.size < 2 && $ChartAxes.has(metric)

  function onClick() {
    if (isDisabled) return

    track.event(
      $ChartAxes.has(metric) ? Event.HideMetricAxis : Event.ShowMetricAxis,
      { metric: metric.key },
    )

    ChartAxes.toggle(metric)
  }
</script>

<Setting on:click={onClick}>
  Show axis
  <Checkbox
    class="mrg-s mrg--l {isDisabled ? '$style.disabled' : ''}"
    isActive={$ChartAxes.has(metric)} />
</Setting>

<style>
  .disabled {
    background-color: var(--porcelain) !important;
    border-color: var(--porcelain) !important;
  }
</style>
