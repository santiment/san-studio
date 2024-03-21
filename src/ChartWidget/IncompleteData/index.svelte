<script lang="ts">
  import type { RestrictionInfo } from 'utils'

  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryRestrictedDates } from '@/api/metrics/restrictions'
  import Info from './Info.svelte'
  import { checkShouldShowBanner, closeBanners, formatDate } from './utils'
  import { showPaywallDialog } from './PaywallDialog.svelte'
  import { track } from 'san-webkit/lib/analytics'

  const shouldShowBanner = checkShouldShowBanner()

  export let chart = null as null | SAN.Charts.Chart
  export let metrics: any[]
  export let settings: any

  let banner
  let restrictions
  let metricRestrictions: any[] | null = null

  queryRestrictedDates().then((data) => (restrictions = data))

  $: restrictedMetrics = restrictions ? filterMetrics(metrics, settings) : []
  $: restrictionsInfo = getRestrictionsInfo(restrictedMetrics)
  $: if (banner && chart) {
    chart.canvas.parentNode?.appendChild(banner)
  }

  function metricsFilter({ key, queryKey = key, project }, settings) {
    if (customRestrictions(queryKey, project || settings)) return

    const data = restrictions[queryKey]
    return data && (data.restrictedFrom || data.restrictedTo)
  }

  function filterMetrics(metrics: any[], settings) {
    metricRestrictions = null
    return metrics?.filter((metric) => metricsFilter(metric, settings)) ?? []
  }

  function getRestrictionsInfo(restrictedMetrics) {
    return restrictedMetrics.map(({ key, queryKey = key, label }) => {
      const { restrictedFrom: from, restrictedTo: to } = restrictions[queryKey]
      const date = from && to ? `${formatDate(from)} - ${formatDate(to)}` : formatDate(from || to)

      return {
        metric: label,
        date,
      }
    })
  }

  function formatMetrics(restrictionsInfo: RestrictionInfo) {
    return restrictionsInfo.map(({ metric, date }) => `${metric} (${date})`)
  }

  function customRestrictions(queryKey: string, { slug } = {}) {
    if (slug !== 'ripple' && slug !== 'xrp') return

    return (
      queryKey.includes('transactions_count') ||
      queryKey.includes('active_addresses') ||
      queryKey.includes('holders_distribution') ||
      queryKey.includes('dex_volume_in') ||
      new Set([
        'daily_assets_issued',
        'total_assets_issued',
        'daily_trustlines_count_change',
        'total_trustlines_count',
        'daily_dex_volume_in_xrp',
        'network_growth',
      ]).has(queryKey)
    )
  }

  function onUpgradeClick() {
    track.event('charts_upgrade_for_full_data_click')
    showPaywallDialog(restrictionsInfo, restrictedMetrics)
  }
</script>

{#if restrictedMetrics.length}
  <button
    class="studio-why-gaps mrg-m mrg--r btn-1 btn--s btn--orange row v-center"
    on:click={onUpgradeClick}
  >
    <Svg id="crown" w="12" />
    Upgrade for full data
  </button>

  {#if shouldShowBanner && chart}
    <div class="limit-banner column body-3 hv-center" bind:this={banner}>
      <button class="close btn" on:click={closeBanners}>
        <Svg id="close" w="14" />
      </button>

      <h2 class="h4 txt-m mrg-xl mrg--b">Upgrade For Full Data</h2>

      <Info
        {restrictedMetrics}
        restrictions={formatMetrics(restrictionsInfo).slice(0, 4).concat('and many others')}
        upgradeClass="btn--l"
      />
    </div>
  {/if}
{/if}

<style>
  .btn-1 {
    --color: var(--orange-hover);
    --color-hover: var(--orange-hover);
    --bg: var(--orange-pale);
    --bg-hover: var(--orange-light-1);

    gap: 10px;
    align-self: flex-end;
    margin-bottom: 8px;
  }

  .tooltip {
    padding: 16px 24px;
    width: 285px;
    z-index: 11 !important;
  }

  .limit-banner {
    color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: #2f354dcc;
    padding: 24px;
    width: 350px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 18px;
    --fill: #fff;
    --fill-hover: var(--green);
  }
</style>
