<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import { withScroll } from 'san-webkit/lib/ui/history'
  import Search from 'san-webkit/lib/ui/Search.svelte'
  import { Event } from './../../../analytics'
  import { getHistoryContext } from './../../../history/ctx'
  import { getWidget } from './../../../ChartWidget/context'
  import { debounced } from './../../../ChartWidget/utils'
  import { queryAvailableVaults } from './api'
  import Dropdown from '../Dropdown.svelte'
  import { onMount } from 'svelte'
  import { capitalize } from 'san-webkit/lib/utils/formatting'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  let loading = true
  let searchTerm = ''

  $: items = []
  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.label_fqn || ''
  $: searchedItems = searchTerm ? filter(items) : items

  const loadVaults = debounced(() => {
    loading = true

    queryAvailableVaults().then((data) => {
      loading = false
      items = data
    })
  })

  function onChange(newOwner) {
    // prettier-ignore
    track.event(Event.MetricVault, { metric: metric.key, vault: newOwner })
    const oldOwner = metricOwner
    const redo = () => setExchange(metric, newOwner)

    redo()
    History.add(
      'Vault change',
      withScroll(widget, () => setExchange(metric, oldOwner)),
      withScroll(widget, redo),
    )
  }

  function setExchange(metric, newVault: string) {
    const { key, queryKey = key } = metric

    // NOTE: Inflow/Outflow requires queryKey change [@vanguard | Sep  2, 2020]
    MetricSettings.set(key, {
      // queryKey: queryKey + (metric.isRootExchangeKey ? '' : '_per_exchange'),
      label_fqn: newVault,
    })
  }

  function onSearch(e: InputEvent) {
    const inputNode = e.currentTarget as HTMLInputElement
    searchTerm = inputNode.value.trim().toLowerCase()
  }

  function filter(items) {
    return items.filter((item) => item.toLowerCase().includes(searchTerm))
  }

  function getLabel(labelFqn: string) {
    return capitalize(labelFqn.split('->')[1] || '')
  }

  onMount(() => {
    loadVaults()
  })
</script>

<Dropdown class="$style.dropdown">
  Vault: {getLabel(metricOwner)}

  <svelte:fragment slot="dropdown">
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
      {#each searchedItems as item}
        <div
          class="btn btn-ghost"
          class:active={metricOwner === item}
          on:click={() => onChange(item)}
        >
          {getLabel(item)}
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
