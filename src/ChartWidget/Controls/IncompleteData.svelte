<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { queryRestrictedDates } from '@/api/metrics/restrictions'
  import { getDateFormats } from 'san-webkit/lib/utils/dates'
  import { getWidget } from '../context'
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
      Your plan has limited data period for:

      <div class="mrg-m mrg--b mrg--t">
        {#each formatMetrics() as restriction}
          <div class="restriction">
            {restriction}
          </div>
        {/each}
      </div>

      To unlock the full potential of Santiment metrics you need to upgrade your account to PRO

      <div class="btn-1 btn--orange body-3 mrg-l mrg--t">Upgrade</div>
    </div>
  </Tooltip>

  {#if chart}
    <div class="banner column body-3 hv-center" bind:this={banner}>
      <h2 class="h4 mrg-xl mrg--b">Incomplete data</h2>
      Your plan has limited data period for:

      <div class="mrg-m mrg--b mrg--t">
        {#each formatMetrics() as restriction}
          <div class="restriction">
            {restriction}
          </div>
        {/each}
      </div>

      To unlock the full potential of Santiment metrics you need to upgrade your account to PRO

      <div class="btn-1 btn--orange body-3 mrg-xl mrg--t">Upgrade</div>
    </div>
  {/if}
{/if}

<style>
  .btn-2 {
    margin-left: auto;
    --color: var(--orange);
    --color-hover: var(--orange-hover);
  }

  .btn-1 {
    text-align: center;
  }

  .tooltip {
    padding: 16px 24px;
    width: 285px;
    z-index: 11 !important;
  }

  .restriction::before {
    content: '●';
    margin-right: 8px;
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
    width: 340px;
    text-align: center;
  }
  .banner::before {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, #00000000 0%, #000000bf 100%);
    height: 100%;
    width: 40px;
    top: 0;
    right: 100%;
  }
</style>
