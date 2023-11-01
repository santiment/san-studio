<script lang="ts">
  import { track } from 'webkit/analytics'
  import { withScroll } from 'webkit/ui/history'
  import Search from 'webkit/ui/Search.svelte'
  import { Event } from '@/analytics'
  import { getHistoryContext } from '@/history/ctx'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { debounced } from '@/ChartWidget/utils'
  import { Metric } from '@/metrics'
  import {
    ExchangeMetricsDefaults,
    OpenInterestMetricsDefaults,
    queryProjectExchanges,
  } from './utils'
  import { queryLabelBasedMetricOwners } from './api'
  import Dropdown from '../Dropdown.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  let loading = true
  let isDex = false
  let searchTerm = ''

  $: isOpenInterestMetric = metric === Metric.exchange_open_interest
  $: metricDefaults = isOpenInterestMetric ? OpenInterestMetricsDefaults : ExchangeMetricsDefaults
  $: exchanges = metricDefaults.owners
  $: defaultExchange = metricDefaults.label

  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.owner || defaultExchange
  $: getExchanges($studio.slug, isDex)
  $: searchedExchanges = searchTerm ? filter(exchanges) : exchanges

  const getExchanges = debounced((slug: string, isDex: boolean) => {
    loading = true

    const promise = isOpenInterestMetric
      ? queryLabelBasedMetricOwners()
      : queryProjectExchanges(slug, isDex)

    promise.then((projectExchanges) => {
      loading = false
      exchanges = metricDefaults.owners.concat(projectExchanges)
    })
  })

  function onChange(newOwner) {
    // prettier-ignore
    track.event(Event.MetricExchange, { metric: metric.key, exchange: newOwner })
    const oldOwner = metricOwner
    const redo = () => setExchange(metric, newOwner)

    redo()
    History.add(
      'Exchange change',
      withScroll(widget, () => setExchange(metric, oldOwner)),
      withScroll(widget, redo),
    )
  }

  function setExchange(metric, newOwner: string) {
    const { key, queryKey = key } = metric

    if (newOwner === defaultExchange) {
      metricDefaults.onDefault(MetricSettings, key)
      return
    }

    // NOTE: Inflow/Outflow requires queryKey change [@vanguard | Sep  2, 2020]
    MetricSettings.set(key, {
      queryKey: queryKey + (metric.isRootExchangeKey ? '' : '_per_exchange'),
      owner: newOwner,
    })
  }

  function onSearch(e: InputEvent) {
    const inputNode = e.currentTarget as HTMLInputElement
    searchTerm = inputNode.value.trim().toLowerCase()
  }

  function filter(exchanges) {
    return exchanges.filter((item) => item.toLowerCase().includes(searchTerm))
  }
</script>

<Dropdown class="$style.dropdown">
  Exchange: {metricOwner}

  <svelte:fragment slot="dropdown">
    <div slot="header" class="tabs row txt-m mrg-s mrg--b">
      {#if !isOpenInterestMetric}
        <div class:tab-active={!isDex} class="tab btn" on:click={() => (isDex = false)}>CEX</div>
        <div class:tab-active={isDex} class="tab btn" on:click={() => (isDex = true)}>DEX</div>
      {/if}
    </div>

    <Search
      class="$style.search mrg-s mrg--b"
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

  .search {
    max-width: 170px;
  }

  .dropdown {
    --max-height: 230px;
  }
</style>
