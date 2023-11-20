<script lang="ts">
  import { Metric } from '@/metrics'
  import { SocialMetric } from '@/metrics/_social'
  import { getAdapterController } from '@/adapter/context'
  import NodeSetting from './NodeSetting.svelte'
  import ColorSetting from './ColorSetting.svelte'
  import IntervalSetting from './IntervalSetting.svelte'
  import ExchangeSetting from './ExchangeSetting/index.svelte'
  import SettlementCurrencySetting from './SettlementCurrency.svelte'
  import { isExchangeModifiable } from './ExchangeSetting/utils'
  import IndicatorSetting from './IndicatorSetting/index.svelte'
  import SmoothingSetting from './SmoothingSetting.svelte'
  import ShowAxisSetting from './ShowAxisSetting.svelte'
  import PinAxisSetting from './PinAxisSetting.svelte'
  import ExpressionSetting from './ExpressionSetting.svelte'
  import TopHoldersSetting from './TopHoldersSetting.svelte'
  import AxisMaxMinSetting from './AxisMaxMinSetting.svelte'
  import { TOP_HOLDERS } from './settings'
  import AddonSettings from '../Addons/Settings.svelte'
  import { ADDONS } from '../Addons/addons'

  const { isEmbedded } = getAdapterController()

  export let metric: Studio.Metric

  $: isNotIndicator = !metric.indicator

  const getBase = (metric: Studio.Metric) => metric.base || metric
</script>

{#key metric.key}
  <div class="row mrg-xs mrg--b caption txt-m v-center">
    {#if ADDONS[metric.key]}
      <AddonSettings addon={metric} />
    {:else}
      {#if isNotIndicator}
        <NodeSetting {metric} />
      {/if}
      <ColorSetting {metric} />

      {#if isExchangeModifiable(metric)}
        <ExchangeSetting {metric} />
      {/if}

      {#if metric === Metric.open_interest_per_settlement_currency || metric === Metric.funding_rates_aggregated_by_settlement_currency}
        <SettlementCurrencySetting {metric} />
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
      <PinAxisSetting {metric} />

      <AxisMaxMinSetting {metric} />
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
