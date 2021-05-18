<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Setting from './Setting.svelte'
  import { getWidget } from '@/ChartWidget/context'
  const { ChartAxes } = getWidget()

  export let metric: Studio.Metric
</script>

<Setting on:click={() => ChartAxes.toggle(metric)}>
  Show axis
  <Checkbox class="mrg-s mrg--l" isActive={$ChartAxes.has(metric)} />
</Setting>
