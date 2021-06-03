<script lang="ts">
  import { studio } from '@/stores/studio'
  import NodeSetting from './NodeSetting.svelte'
  import ColorSetting from './ColorSetting.svelte'
  import IntervalSetting from './IntervalSetting.svelte'
  import ExchangeSetting from './ExchangeSetting/index.svelte'
  import { isExchangeModifiable } from './ExchangeSetting/utils'
  import IndicatorSetting from './IndicatorSetting/index.svelte'
  import ShowAxisSetting from './ShowAxisSetting.svelte'

  export let metric: Studio.Metric
  $: ticker = $studio.ticker
  $: isNotIndicator = !metric.indicator
  $: label =
    metric.project || metric.noProject
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
    {#if isExchangeModifiable(metric)}
      <ExchangeSetting {metric} />
    {/if}
    {#if isNotIndicator}
      <IntervalSetting {metric} />
      <IndicatorSetting {metric} />
    {/if}
    <ShowAxisSetting {metric} />
  </div>
{/key}
