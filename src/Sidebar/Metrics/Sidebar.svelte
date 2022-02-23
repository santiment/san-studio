<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { getAdapterController } from '@/adapter/context'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryProjectMetrics } from '@/api/metrics'
  import { filterSelectorGraph, getMetricsSelectorGraph } from '@/metrics/selector/utils'
  import { DEFAULT_METRICS } from './defaults'
  import HoverItem from './HoverItem.svelte'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import Insights from './Insights/index.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'

  const { onSidebarProjectMount = () => {} } = getAdapterController()
  const LockedAsset = getLockedAssetStore() as any

  export let onItemClick

  let projectNode
  let metrics: string[] = DEFAULT_METRICS
  let searchTerm = ''

  $: LockedAsset.set($studio)
  $: ({ slug } = $LockedAsset)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(metrics, Object.assign({}, $globals, $LockedAsset))
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph
  $: queryProjectMetrics(slug).then((items) => (metrics = items))
  $: onSidebarProjectMount(projectNode)
</script>

<div class="sidebar-header">
  <div class="sidebar-project" bind:this={projectNode} />
  <Search bind:searchTerm />
  <div class="caption c-waterloo mrg-s mrg--t">Available metrcis for asset: {metrics.length}</div>
</div>
<div class="sidebar-content" on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
  <Favorites {searchTerm} {isFiltering} {onItemClick} />
  <Insights {searchTerm} {isFiltering} />
  <Notables {searchTerm} {isFiltering} {onItemClick} />
  {#each categories as category}
    <Category {category} {isFiltering} items={filteredGraph[category]} {HoverItem} {onItemClick} />
  {/each}
</div>
