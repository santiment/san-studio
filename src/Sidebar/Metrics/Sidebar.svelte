<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryProjectMetrics } from '@/api/metrics'
  import {
    filterSelectorGraph,
    getMetricsSelectorGraph,
  } from '@/metrics/selector/utils'
  import { DEFAULT_METRICS } from './defaults'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import Insights from './Insights/index.svelte'
  import Tabs from '../Tabs.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'
  import HoverItem from '../HoverItem.svelte'

  const LockedAsset = getLockedAssetStore() as any

  export let onItemClick

  let metrics: string[] = DEFAULT_METRICS
  let searchTerm = ''
  let isMetricTab = true

  $: LockedAsset.set($studio)
  $: ({ slug } = $LockedAsset)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(
    metrics,
    Object.assign({}, $globals, $LockedAsset),
  )
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph
  $: queryProjectMetrics(slug).then((items) => (metrics = items))
</script>

<div class="sidebar-header">
  <Tabs bind:isMetricTab />
  <div class="mrg-l mrg--t sidebar-project" />
  <Search bind:searchTerm />
</div>
<div class="sidebar-content">
  {#if isMetricTab}
    <Favorites {searchTerm} {isFiltering} {onItemClick} />
    <Notables {searchTerm} {isFiltering} {onItemClick} />
    {#each categories as category}
      <Category
        {category}
        {isFiltering}
        items={filteredGraph[category]}
        {HoverItem}
        {onItemClick} />
    {/each}
  {:else}
    <Insights />
  {/if}
</div>
