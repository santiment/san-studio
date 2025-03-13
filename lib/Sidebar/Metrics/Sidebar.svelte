<script lang="ts">
  import type { MetricCategory } from './../../metrics/graph'

  import { studio, getLockedAssetStore } from './../../stores/studio'
  import { globals } from './../../stores/globals'
  import LockedAsset from './../../LockedAsset/index.svelte'
  import { queryAddressMetrics, queryProjectMetrics } from './../../api/metrics'
  import { filterSelectorGraph, getMetricsSelectorGraph } from './../../metrics/selector/utils'
  import { DEFAULT_METRICS } from './defaults'
  import HoverItem from './HoverItem.svelte'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import Insights from './Insights/index.svelte'
  import KeyEvents from './KeyEvents/index.svelte'
  import CombinedMetrics from './CombinedMetrics/index.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'
  import { setContext } from 'svelte'

  const LockedAsset$ = getLockedAssetStore() as any

  export let onItemClick

  let metrics: string[] = DEFAULT_METRICS
  let searchTerm = ''
  let documentation = setContext('documentation', { metrics: {} })

  $: LockedAsset$.set($studio)
  $: ({ slug, address } = $LockedAsset$)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(metrics, Object.assign({}, $globals, $LockedAsset$))
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph
  $: getMetrics(slug, address)

  const setMetrics = (data) => (metrics = data || [])
  function getMetrics(slug: string, address?: string) {
    const promise = address
      ? queryAddressMetrics(address)
      : queryProjectMetrics(slug).then((data) => {
          documentation.metrics = data.docs || {}
          return data.metrics
        })

    return promise.then(setMetrics)
  }
</script>

<div class="sidebar-header">
  <LockedAsset />

  <Search bind:searchTerm />

  <div class="caption c-waterloo mrg-s mrg--t">Available metrics for asset: {metrics.length}</div>
</div>

<div class="sidebar-content" on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
  <Favorites {searchTerm} {isFiltering} {onItemClick} />
  <KeyEvents {searchTerm} {isFiltering} {onItemClick} />
  <Insights {searchTerm} {isFiltering} />
  <CombinedMetrics {searchTerm} {isFiltering} {onItemClick} />

  {#if !address}
    <Notables {searchTerm} {isFiltering} {onItemClick} />
  {/if}

  {#each categories as category}
    <Category {category} {isFiltering} items={filteredGraph[category]} {HoverItem} {onItemClick} />
  {/each}
</div>

<style>
  :global(.sidebar-project) {
    max-width: 226px;
  }
</style>
