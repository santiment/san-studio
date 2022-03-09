<script lang="ts">
  import { track } from 'webkit/analytics'
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import { Event } from '@/analytics'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { debounced } from '@/ChartWidget/utils'
  import { DEFAULT_EXCHANGE, DEFAULT_EXCHANGES, queryProjectExchanges } from './utils'
  import Dropdown from '../Dropdown.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  let loading = true
  let isDex = false
  let exchanges = DEFAULT_EXCHANGES

  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.owner || DEFAULT_EXCHANGE
  $: getExchanges($studio.slug, isDex)

  const getExchanges = debounced((slug: string, isDex: boolean) => {
    loading = true
    queryProjectExchanges(slug, isDex).then((projectExchanges) => {
      loading = false
      exchanges = DEFAULT_EXCHANGES.concat(projectExchanges)
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

    if (newOwner === DEFAULT_EXCHANGE) {
      MetricSettings.delete(key, 'queryKey')
      MetricSettings.delete(key, 'owner')
      return
    }

    // NOTE: Inflow/Outflow requires queryKey change [@vanguard | Sep  2, 2020]
    MetricSettings.set(key, {
      queryKey: queryKey + '_per_exchange',
      owner: newOwner,
    })
  }
</script>

<Dropdown>
  Exchange: {metricOwner}

  <svelte:fragment slot="dropdown">
    <div slot="header" class="tabs row txt-m mrg-s mrg--b">
      <div class:tab-active={!isDex} class="tab btn" on:click={() => (isDex = false)}>CEX</div>
      <div class:tab-active={isDex} class="tab btn" on:click={() => (isDex = true)}>DEX</div>
    </div>

    {#if loading}
      <div class="loading" />
    {/if}

    <div class="options">
      {#each exchanges as exchange}
        <div
          class="btn btn-ghost"
          class:active={metricOwner === exchange}
          on:click={() => onChange(exchange)}>
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
</style>
