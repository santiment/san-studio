<script lang="ts">
  import { studio } from '@/stores/studio'
  import NodeSetting from './NodeSetting.svelte'
  import ColorSetting from './ColorSetting.svelte'
  import IntervalSetting from './IntervalSetting.svelte'
  import IndicatorSetting from './IndicatorSetting/index.svelte'
  import ShowAxisSetting from './ShowAxisSetting.svelte'

  export let metric: Studio.Metric
  $: ticker = $studio.ticker
  $: isNotIndicator = !metric.indicator
  $: label = metric.project
    ? metric.label
    : metric.getLabel?.(ticker) || `${metric.label} (${ticker})`
</script>

{#key metric.key}
  <div class="row mrg-xs mrg--b caption txt-m v-center">
    {label}:

    {#if isNotIndicator}
      <NodeSetting {metric} />
    {/if}
    <ColorSetting {metric} />
    {#if isNotIndicator}
      <IntervalSetting {metric} />
      <IndicatorSetting {metric} />
    {/if}
    <ShowAxisSetting {metric} />
  </div>
{/key}
