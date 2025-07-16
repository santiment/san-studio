<script>var _a;
import { queryRestrictedDates } from './../../api/metrics/restrictions';
import './../../ChartWidget/context';
import { BRUSH_HEIGHT } from './../../Chart/Brush/utils';
import Info from './Info.svelte';
import { formatDate } from './utils';
export let chart = null;
export let metrics;
export let settings;
export let hiddenMetrics;
export let hideMetric;
let banner;
let restrictions;
let metricRestrictions = null;
const brushHeight = `${BRUSH_HEIGHT}px`;
queryRestrictedDates().then((data) => (restrictions = data));
$: restrictedMetrics = restrictions ? filterMetrics(metrics, settings) : [];
$: visibleRestricted = restrictedMetrics.filter((metric) => !hiddenMetrics.has(metric));
$: restrictionsInfo = getRestrictionsInfo(restrictedMetrics);
$: if (banner && chart) {
    (_a = chart.canvas.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(banner);
}
function metricsFilter({ key, queryKey = key, project }, settings) {
    if (customRestrictions(queryKey, project || settings))
        return;
    const data = restrictions[queryKey];
    return data && (data.restrictedFrom || data.restrictedTo);
}
function filterMetrics(metrics, settings) {
    var _a;
    metricRestrictions = null;
    return (_a = metrics === null || metrics === void 0 ? void 0 : metrics.filter((metric) => metricsFilter(metric, settings))) !== null && _a !== void 0 ? _a : [];
}
function getRestrictionsInfo(restrictedMetrics) {
    return restrictedMetrics.map(({ key, queryKey = key, label }) => {
        const { restrictedFrom: from, restrictedTo: to } = restrictions[queryKey];
        const date = from && to ? `${formatDate(from)} - ${formatDate(to)}` : formatDate(from || to);
        return {
            metric: label,
            date,
        };
    });
}
function formatMetrics(restrictionsInfo) {
    return restrictionsInfo.map(({ metric, date }) => `${metric} (${date})`);
}
function customRestrictions(queryKey, { slug } = {}) {
    if (slug !== 'ripple' && slug !== 'xrp')
        return;
    return (queryKey.includes('transactions_count') ||
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
        ]).has(queryKey));
}
</script>

{#if visibleRestricted.length && chart}
  <div
    class="limit-banner column body-3 hv-center"
    style="--brush-height: {brushHeight}"
    bind:this={banner}
  >
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
    bottom: var(--brush-height);
    right: 0;
    z-index: 10;
    background: #2f354dcc;
    padding: 24px;
    width: 350px;
    text-align: center;
  }
</style>
