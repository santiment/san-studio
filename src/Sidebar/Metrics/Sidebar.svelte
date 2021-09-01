<script lang="ts" context="module">
  enum Tab {
    Metrics = 'Metrics',
    Insights = 'Insights',
  }
  const TABS = [Tab.Metrics, Tab.Insights]
</script>

<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { getAdapterController } from '@/adapter/context'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryProjectMetrics } from '@/api/metrics'
  import {
    filterSelectorGraph,
    getMetricsSelectorGraph,
  } from '@/metrics/selector/utils'
  import { DEFAULT_METRICS } from './defaults'
  import HoverItem from './HoverItem.svelte'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import Insights from './Insights/index.svelte'
  import Tabs from '../Tabs.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'

  const { onSidebarProjectMount = () => {} } = getAdapterController()
  const LockedAsset = getLockedAssetStore() as any

  export let onItemClick

  let projectNode
  let metrics: string[] = DEFAULT_METRICS
  let searchTerm = ''
  let tab = Tab.Metrics

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
  $: onSidebarProjectMount(projectNode)
</script>

<div class="sidebar-header">
  <Tabs tabs={TABS} bind:tab />
  <div class="mrg-l mrg--t sidebar-project" bind:this={projectNode} />
  <Search bind:searchTerm />
</div>
<div class="sidebar-content" on:scroll={() => window.__clearHoverItem?.()}>
  {#if tab === Tab.Metrics}
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
