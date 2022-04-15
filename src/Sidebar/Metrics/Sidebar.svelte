<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { getAdapterController } from '@/adapter/context'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryAddressMetrics, queryProjectMetrics } from '@/api/metrics'
  import { filterSelectorGraph, getMetricsSelectorGraph } from '@/metrics/selector/utils'
  import { DEFAULT_METRICS } from './defaults'
  import HoverItem from './HoverItem.svelte'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import Insights from './Insights/index.svelte'
  import CombinedMetrics from './CombinedMetrics/index.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'

  const { onSidebarProjectMount = () => {} } = getAdapterController()
  const LockedAsset = getLockedAssetStore() as any

  export let onItemClick

  let projectNode
  let metrics: string[] = DEFAULT_METRICS
  let searchTerm = ''

  $: LockedAsset.set($studio)
  $: ({ slug, address } = $LockedAsset)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(metrics, Object.assign({}, $globals, $LockedAsset))
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph
  $: getMetrics(slug, address)
  $: onSidebarProjectMount(projectNode)

  const setMetrics = (data) => (metrics = data)
  function getMetrics(slug: string, address?: string) {
    return (address ? queryAddressMetrics(address) : queryProjectMetrics(slug)).then(setMetrics)
  }
</script>

<div class="sidebar-header">
  <div class="sidebar-project" bind:this={projectNode} />
  <Search bind:searchTerm />
  <div class="caption c-waterloo mrg-s mrg--t">Available metrics for asset: {metrics.length}</div>
</div>
<div class="sidebar-content" on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
  <Favorites {searchTerm} {isFiltering} {onItemClick} />
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
