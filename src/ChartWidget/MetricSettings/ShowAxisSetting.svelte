<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Setting from './Setting.svelte'
  import { getWidget } from '@/ChartWidget/context'
  const { ChartAxes } = getWidget()

  export let metric: Studio.Metric

  $: isDisabled = $ChartAxes.size < 2 && $ChartAxes.has(metric)
</script>

<Setting on:click={() => isDisabled || ChartAxes.toggle(metric)}>
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
