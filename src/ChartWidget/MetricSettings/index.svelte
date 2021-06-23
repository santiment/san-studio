<script lang="ts">
  import { Metric } from '@/metrics'
  import { SocialMetric } from '@/metrics/_social'
  import { studio } from '@/stores/studio'
  import NodeSetting from './NodeSetting.svelte'
  import ColorSetting from './ColorSetting.svelte'
  import IntervalSetting from './IntervalSetting.svelte'
  import ExchangeSetting from './ExchangeSetting/index.svelte'
  import { isExchangeModifiable } from './ExchangeSetting/utils'
  import IndicatorSetting from './IndicatorSetting/index.svelte'
  import SmoothingSetting from './SmoothingSetting.svelte'
  import ShowAxisSetting from './ShowAxisSetting.svelte'

  export let metric: Studio.Metric
  $: ticker = $studio.ticker
  $: isNotIndicator = !metric.indicator
  $: label =
    metric.project || metric.noProject
      ? metric.label
      : metric.getLabel?.(ticker) || `${metric.label} (${ticker})`

  const getBase = (metric: Studio.Metric) => metric.base || metric
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
      {#if getBase(metric) !== Metric.dev_activity}
        <IndicatorSetting {metric} />
      {/if}
    {/if}
    {#if isNotIndicator && SocialMetric[getBase(metric).key]}
      <SmoothingSetting {metric} />
    {/if}
    <ShowAxisSetting {metric} />
  </div>
{/key}

<style>
  div {
    flex-wrap: wrap;
  }
</style>
