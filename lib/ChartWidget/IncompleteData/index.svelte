<script lang="ts">
  import type { RestrictionInfo } from './utils'

  import { queryRestrictedDates } from './../../api/metrics/restrictions'
  import { getWidget } from './../../ChartWidget/context'
  import Info from './Info.svelte'
  import { formatDate } from './utils'

  export let chart = null as null | SAN.Charts.Chart
  export let metrics: any[]
  export let settings: any
  export let hiddenMetrics: Set<Studio.Metric>
  export let hideMetric: (metric: Studio.Metric) => void

  let banner
  let restrictions
  let metricRestrictions: any[] | null = null

  queryRestrictedDates().then((data) => (restrictions = data))

  $: restrictedMetrics = restrictions ? filterMetrics(metrics, settings) : []
  $: visibleRestricted = restrictedMetrics.filter((metric) => !hiddenMetrics.has(metric))
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

  function formatMetrics(restrictionsInfo: RestrictionInfo[]) {
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
</script>

{#if visibleRestricted.length && chart}
  <div class="limit-banner column body-3 hv-center" bind:this={banner}>
    <h2 class="h4 txt-m mrg-xl mrg--b">Upgrade For Full Data</h2>

    <Info
      {restrictedMetrics}
      restrictions={formatMetrics(restrictionsInfo).slice(0, 4).concat('and many others')}
      {hideMetric}
    />
  </div>
{/if}

<style>
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
</style>
