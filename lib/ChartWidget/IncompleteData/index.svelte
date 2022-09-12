<script lang="ts">var _a;

import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { queryRestrictedDates } from './../../../lib/api/metrics/restrictions';
import { getWidget } from './../../../lib/ChartWidget/context';
import Info from './Info.svelte';
import { checkShouldShowBanner, closeBanners, formatDate } from './utils';
const {
  Metrics
} = getWidget();
const shouldShowBanner = checkShouldShowBanner();
export let chart;
let banner;
let restrictions;
let metricRestrictions = null;
queryRestrictedDates().then(data => restrictions = data);

$: restrictedMetrics = restrictions ? filterMetrics($Metrics) : [];

$: if (banner && chart) {
  (_a = chart.canvas.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(banner);
}

function metricsFilter({
  key,
  queryKey = key
}) {
  const data = restrictions[queryKey];
  return data && (data.restrictedFrom || data.restrictedTo);
}

function filterMetrics(metrics) {
  metricRestrictions = null;
  return metrics.filter(metricsFilter);
}

function formatMetrics() {
  if (metricRestrictions) return metricRestrictions;
  metricRestrictions = restrictedMetrics.map(({
    key,
    queryKey = key,
    label
  }) => {
    const {
      restrictedFrom: from,
      restrictedTo: to
    } = restrictions[queryKey];
    const date = from && to ? `${formatDate(from)} - ${formatDate(to)}` : formatDate(from || to);
    return `${label} (${date})`;
  });
  return metricRestrictions;
}</script>

{#if restrictedMetrics.length}
  <Tooltip duration={0} openDelay={110} align="center" class="tooltip-HDhzta">
    <div slot="trigger" class="studio-why-gaps mrg-m mrg--r btn-2 btn-1 btn--s btn--orange">
      Incomplete data
    </div>

    <div slot="tooltip" class="caption c-waterloo">
      <h2 class="txt-m c-black mrg-m mrg--b">Why is some data hidden?</h2>
      <Info restrictions={formatMetrics()} {restrictedMetrics} />
    </div>
  </Tooltip>

  {#if shouldShowBanner && chart}
    <div class="limit-banner column body-3 hv-center" bind:this={banner}>
      <div class="close btn" on:click={closeBanners}>
        <Svg id="close" w="14" />
      </div>

      <h2 class="h4 txt-m mrg-xl mrg--b">Incomplete data</h2>

      <Info
        {restrictedMetrics}
        restrictions={formatMetrics().slice(0, 4).concat('and many others')}
        upgradeClass="btn--l"
        isBanner
      />
    </div>
  {/if}
{/if}

<style>
  .btn-2 {
    --color: var(--orange);
    --color-hover: var(--orange-hover);
  }

  :global(.tooltip-HDhzta) {
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
    background: #000000bf;
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
