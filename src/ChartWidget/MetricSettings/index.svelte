<script lang="ts">
  import { Metric } from '@/metrics'
  import { SocialMetric } from '@/metrics/_social'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import NodeSetting from './NodeSetting.svelte'
  import ColorSetting from './ColorSetting.svelte'
  import IntervalSetting from './IntervalSetting.svelte'
  import ExchangeSetting from './ExchangeSetting/index.svelte'
  import { isExchangeModifiable } from './ExchangeSetting/utils'
  import IndicatorSetting from './IndicatorSetting/index.svelte'
  import SmoothingSetting from './SmoothingSetting.svelte'
  import ShowAxisSetting from './ShowAxisSetting.svelte'
  import ExpressionSetting from './ExpressionSetting.svelte'
  import TopHoldersSetting from './TopHoldersSetting.svelte'
  import { TOP_HOLDERS } from './settings'

  const { isEmbedded } = getAdapterController()

  export let metric: Studio.Metric

  $: isNotIndicator = !metric.indicator

  const getBase = (metric: Studio.Metric) => metric.base || metric
</script>

{#key metric.key}
  <div class="row mrg-xs mrg--b caption txt-m v-center">
    {#if isNotIndicator}
      <NodeSetting {metric} />
    {/if}
    <ColorSetting {metric} />
    {#if isExchangeModifiable(metric)}
      <ExchangeSetting {metric} />
    {/if}
    {#if isNotIndicator && !isEmbedded}
      <IntervalSetting {metric} />
      {#if getBase(metric) !== Metric.dev_activity && !metric.baseMetrics}
        <IndicatorSetting {metric} />
      {/if}
    {/if}
    {#if isNotIndicator && SocialMetric[getBase(metric).key]}
      <SmoothingSetting {metric} />
    {/if}
    {#if TOP_HOLDERS.has(metric)}
      <TopHoldersSetting {metric} />
    {/if}
    <ShowAxisSetting {metric} />
    {#if $globals.isBeta && metric.expression}
      <ExpressionSetting {metric} />
    {/if}
  </div>
{/key}

<style>
  div {
    flex-wrap: wrap;
    margin-left: -16px;
  }
</style>
