<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg.svelte'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { queryProjectMetrics } from '@/api/metrics'
  import {
    getMetricsSelectorGraph,
    filterSelectorGraph,
  } from '@/metrics/selector/utils'
  import { getSavedValue, saveValue } from '@/utils/localStorage'
  import { getNodeController } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  import Sidebar from './Sidebar.svelte'
  import Insights from './Insights/index.svelte'
  import Category from './Category.svelte'
  import Favorites from './Favorites.svelte'
  import Notables from './Notables/index.svelte'
  import ItemActions from './ItemActions.svelte'
  import Tabs from './Tabs.svelte'
  import Toggle from './Toggle.svelte'
  import { DEFAULT_METRICS } from './defaults'

  const History = getHistoryContext()
  const NodeController = getNodeController()
  const { checkIsMapviewDisabled } = getAdapterController()
  const LockedAsset = getLockedAssetStore()
  const LS_IS_SIDEBAR_LOCKED = 'LS_IS_SIDEBAR_LOCKED'

  export let graph

  let searchRef
  let input = ''
  let metrics: string[] = DEFAULT_METRICS
  let isMetricTab = true

  let isLocked = !!getSavedValue(LS_IS_SIDEBAR_LOCKED, true)
  let isPeeked = false

  $: isOpened = isPeeked // || isDraggingMetric

  $: LockedAsset.set($studio)
  $: ({ slug } = $LockedAsset)
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(metrics, $LockedAsset)
  $: loweredInput = input.toLowerCase()
  $: filteredGraph = loweredInput
    ? filterSelectorGraph(graph, loweredInput)
    : graph
  $: isFiltering = !!input
  $: queryProjectMetrics(slug).then((items) => (metrics = items))
  $: saveValue(LS_IS_SIDEBAR_LOCKED, isLocked ? '+' : '')

  let debounced: number
  function onInput({ target }) {
    window.clearTimeout(debounced)
    debounced = window.setTimeout(() => {
      input = target.value
    }, 200)
  }

  let hoveredItem = null
  let hoveredNode = null
  function onItemEnter(node, metric) {
    hoveredItem = metric
    hoveredNode = node
  }

  function onItemLeave() {
    hoveredItem = null
    hoveredNode = null
  }

  function onItemClick(e: MouseEvent, item: any) {
    if (checkIsMapviewDisabled?.()) return

    NodeController(item, e, History)
    searchRef?.focus()
  }
</script>

<Sidebar bind:isOpened bind:isLocked bind:isPeeked>
  <div class="top">
    <Tabs bind:isMetricTab />
    <div class="mrg-l mrg--t sidebar-project" />
    <div class="input border mrg-s mrg--t row v-center fluid">
      <Svg id="search" w="12" class="$style.search" />
      <input
        bind:this={searchRef}
        name=""
        type="text"
        on:input={onInput}
        placeholder="Search metrics" />
    </div>
  </div>
  <div class="categories" on:scroll={onItemLeave} on:mouseleave={onItemLeave}>
    {#if isMetricTab}
      <ItemActions
        node={hoveredNode}
        item={hoveredItem}
        {onItemClick}
        {onItemEnter}
        {onItemLeave} />
      <Favorites {isFiltering} {onItemEnter} searchTerm={loweredInput} />
      <Notables searchTerm={loweredInput} {isFiltering} {onItemClick} />
      {#each categories as category}
        <Category
          {category}
          {isFiltering}
          {onItemEnter}
          items={filteredGraph[category]} />
      {/each}
    {:else}
      <Insights />
    {/if}
  </div>
  <Toggle bind:isLocked />
</Sidebar>

<style>
  .top {
    padding: 16px 24px;
    border-bottom: 1px solid var(--porcelain);
  }

  .input {
    position: relative;
    fill: var(--casper);
  }
  .input:hover,
  .input:focus-within {
    border-color: var(--green);
    fill: var(--green);
  }

  input {
    height: 32px;
    flex: 1;
    padding: 6px 6px 6px 36px;
    border-radius: 4px;
    color: var(--black);
  }

  .search {
    position: absolute;
    left: 14px;
  }

  .categories {
    flex: 1;
    overflow: hidden;
    scrollbar-width: thin;
    padding-bottom: 30vh;
  }

  .categories:hover {
    overflow-y: auto;
    overflow-y: overlay;
  }
</style>
