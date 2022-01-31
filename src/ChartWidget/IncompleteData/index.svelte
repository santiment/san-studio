<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryRestrictedDates } from '@/api/metrics/restrictions'
  import { getDateFormats } from 'san-webkit/lib/utils/dates'
  import { getWidget } from '@/ChartWidget/context'
  import Info from './Info.svelte'
  const { Metrics } = getWidget()

  export let chart: SAN.Charts.Chart

  let banner
  let restrictions
  let metricRestrictions: any[] | null = null

  queryRestrictedDates().then((data) => (restrictions = data))

  $: restrictedMetrics = restrictions ? filterMetrics($Metrics) : []

  $: if (banner && chart) {
    chart.canvas.parentNode?.appendChild(banner)
  }

  function metricsFilter({ key, queryKey = key }) {
    const data = restrictions[queryKey]
    return data && (data.restrictedFrom || data.restrictedTo)
  }
  function filterMetrics(metrics: any[]) {
    metricRestrictions = null
    return metrics.filter(metricsFilter)
  }

  function formatMetrics() {
    if (metricRestrictions) return metricRestrictions

    metricRestrictions = restrictedMetrics.map(({ key, queryKey = key, label }) => {
      const { restrictedFrom: from, restrictedTo: to } = restrictions[queryKey]
      console.log(label)
      const date = from && to ? `${formatDate(from)} - ${formatDate(to)}` : formatDate(from || to)
      return `${label} (${date})`
    })
    return metricRestrictions
  }

  function formatDate(date: string) {
    const { DD, MMM, YY } = getDateFormats(new Date(date))
    return `${DD} ${MMM}, ${YY}`
  }
</script>

{#if restrictedMetrics.length}
  <Tooltip duration={0} align="center" class="$style.tooltip">
    <div slot="trigger" class="studio-why-gaps mrg-m mrg--r btn-2 btn-1 btn--s btn--orange">
      Incomplete data
    </div>

    <div slot="tooltip" class="caption c-waterloo">
      <h2 class="txt-m c-black mrg-m mrg--b">Why is some data hidden?</h2>
      <Info restrictions={formatMetrics()} />
    </div>
  </Tooltip>

  {#if chart}
    <div class="banner column body-3 hv-center" bind:this={banner}>
      <div class="close btn">
        <Svg id="close" w="14" />
      </div>

      <h2 class="h4 txt-m mrg-xl mrg--b">Incomplete data</h2>

      <Info
        restrictions={formatMetrics().slice(0, 4).concat('and many others')}
        upgradeClass="btn--l" />
    </div>
  {/if}
{/if}

<style>
  .btn-2 {
    margin-left: auto;
    --color: var(--orange);
    --color-hover: var(--orange-hover);
  }

  .tooltip {
    padding: 16px 24px;
    width: 285px;
    z-index: 11 !important;
  }

  .banner {
    color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: #000000bf;
    padding: 24px;
    width: 390px;
    text-align: center;

    padding-left: 75px;
    background: linear-gradient(90deg, #00000000 0%, #000000bf 15%, #000000bf 100%);
  }

  .close {
    position: absolute;
    top: 16px;
    right: 18px;
    --fill: #fff;
    --fill-hover: var(--green);
  }
</style>
