<script>import { track } from 'san-webkit/lib/analytics';
import { withScroll } from 'san-webkit/lib/ui/history';
import Search from 'san-webkit/lib/ui/Search.svelte';
import { Event } from './../../../analytics';
import { getHistoryContext } from './../../../history/ctx';
import { studio } from './../../../stores/studio';
import { getWidget } from './../../../ChartWidget/context';
import { debounced } from './../../../ChartWidget/utils';
import { Metric } from './../../../metrics';
import { ExchangeMetricsDefaults, OpenInterestMetricsDefaults, queryProjectExchanges, } from './utils';
import { queryLabelBasedMetricOwners } from './api';
import Dropdown from '../Dropdown.svelte';
const History = getHistoryContext();
const widget = getWidget();
const { MetricSettings } = widget;
export let metric;
let loading = true;
let isDex = false;
let searchTerm = '';
$: isOpenInterestMetric =
    metric === Metric.exchange_open_interest ||
        metric === Metric.funding_rates_aggregated_by_exchange;
$: metricDefaults = isOpenInterestMetric ? OpenInterestMetricsDefaults : ExchangeMetricsDefaults;
$: exchanges = metricDefaults.owners;
$: defaultExchange = metricDefaults.label;
$: metricSettings = $MetricSettings[metric.key];
$: metricOwner = (metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.owner) || defaultExchange;
$: getExchanges($studio.slug, isDex);
$: searchedExchanges = searchTerm ? filter(exchanges) : exchanges;
const getExchanges = debounced((slug, isDex) => {
    loading = true;
    const promise = isOpenInterestMetric
        ? queryLabelBasedMetricOwners()
        : queryProjectExchanges(slug, isDex);
    promise.then((projectExchanges) => {
        loading = false;
        exchanges = metricDefaults.owners.concat(projectExchanges);
    });
});
function onChange(newOwner) {
    // prettier-ignore
    track.event(Event.MetricExchange, { metric: metric.key, exchange: newOwner });
    const oldOwner = metricOwner;
    const redo = () => setExchange(metric, newOwner);
    redo();
    History.add('Exchange change', withScroll(widget, () => setExchange(metric, oldOwner)), withScroll(widget, redo));
}
function setExchange(metric, newOwner) {
    const { key, queryKey = key } = metric;
    if (newOwner === defaultExchange) {
        metricDefaults.onDefault(MetricSettings, key);
        return;
    }
    // NOTE: Inflow/Outflow requires queryKey change [@vanguard | Sep  2, 2020]
    MetricSettings.set(key, {
        queryKey: queryKey + (metric.isRootExchangeKey ? '' : '_per_exchange'),
        owner: newOwner,
    });
}
function onSearch(e) {
    const inputNode = e.currentTarget;
    searchTerm = inputNode.value.trim().toLowerCase();
}
function filter(exchanges) {
    return exchanges.filter((item) => item.toLowerCase().includes(searchTerm));
}
</script>

<Dropdown class="dropdown-Wyh6LV">
  Exchange: {metricOwner}

  <svelte:fragment slot="dropdown">
    <div class="tabs row txt-m mrg-s mrg--b">
      {#if !isOpenInterestMetric}
        <div class:tab-active={!isDex} class="tab btn" on:click={() => (isDex = false)}>CEX</div>
        <div class:tab-active={isDex} class="tab btn" on:click={() => (isDex = true)}>DEX</div>
      {/if}
    </div>

    <Search
      class="search-mwWeJD mrg-s mrg--b"
      autofocus
      placeholder="Type to search"
      on:input={onSearch}
    />

    {#if loading}
      <div class="loading" />
    {/if}

    <div class="options">
      {#each searchedExchanges as exchange}
        <div
          class="btn btn-ghost"
          class:active={metricOwner === exchange}
          on:click={() => onChange(exchange)}
        >
          {exchange}
        </div>
      {/each}
    </div>
  </svelte:fragment>
</Dropdown>

<style>
  .btn::first-letter {
    text-transform: capitalize;
  }

  .tabs {
    color: var(--casper);
  }

  .tab {
    padding: 0 0 8px;
    flex: 1;
    text-align: center;
    border-bottom: 2px solid var(--porcelain);
    border-radius: 0;
    --color-hover: var(--green);
  }
  .tab-active {
    --color: var(--black);
    border-color: var(--green);
    font-weight: 600;
  }

  .options {
    overflow: auto;
    min-width: 165px;
  }

  :global(.search-mwWeJD) {
    max-width: 170px;
  }

  :global(.dropdown-Wyh6LV) {
    --max-height: 230px;
  }
</style>
