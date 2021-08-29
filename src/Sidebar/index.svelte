<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import { getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg.svelte'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryProjectMetrics } from '@/api/metrics'
  import {
    getMetricsSelectorGraph,
    filterSelectorGraph,
  } from '@/metrics/selector/utils'
  import { getSavedValue, saveValue } from '@/utils/localStorage'
  import { getNodeController } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  import { DEFAULT_METRICS } from './defaults'
  import Sidebar from './Sidebar.svelte'
  import Category from './Category.svelte'
  import Tabs from './Tabs.svelte'
  import Toggle from './Toggle.svelte'
  import Modes from './Modes.svelte'
  import Insights from './Metrics/Insights/index.svelte'
  import Favorites from './Metrics/Favorites.svelte'
  import Notables from './Metrics/Notables/index.svelte'

  const History = getHistoryContext()
  const NodeController = getNodeController()
  const { checkIsMapviewDisabled } = getAdapterController()
  const LockedAsset = getLockedAssetStore()
  const LS_IS_SIDEBAR_LOCKED = 'LS_IS_SIDEBAR_LOCKED'

  export let graph

  let input = ''
  let metrics: string[] = DEFAULT_METRICS
  let isMetricTab = true

  let isLocked = !!getSavedValue(LS_IS_SIDEBAR_LOCKED, true)
  let isPeeked = false

  $: isOpened = isPeeked // || isDraggingMetric

  $: LockedAsset.set($studio)
  $: ({ slug } = $LockedAsset)
  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(
    metrics,
    Object.assign({}, $globals, $LockedAsset),
  )
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

  function onItemClick(e: MouseEvent, item: any) {
    if (checkIsMapviewDisabled?.()) return
    NodeController(item, e, History)
  }
</script>

<Sidebar bind:isOpened bind:isLocked bind:isPeeked>
  <svelte:fragment slot="left">
    <Modes />
  </svelte:fragment>

  <div class="top">
    <Tabs bind:isMetricTab />
    <div class="mrg-l mrg--t sidebar-project" />
    <div class="input border mrg-s mrg--t row v-center fluid">
      <Svg id="search" w="12" class="$style.search" />
      <input
        name=""
        type="text"
        on:input={onInput}
        placeholder="Search metrics" />
    </div>
  </div>
  <div class="categories">
    {#if isMetricTab}
      <Favorites {isFiltering} searchTerm={loweredInput} />
      <Notables searchTerm={loweredInput} {isFiltering} {onItemClick} />
      {#each categories as category}
        <Category
          {category}
          {isFiltering}
          items={filteredGraph[category]}
          {onItemClick} />
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
