<script lang="ts">
  import type { MetricCategory } from '@/metrics/graph'
  import Icon from 'webkit/ui/Icon.svelte'
  import { studio } from '@/stores/studio'
  import { queryProjectMetrics } from '@/api/metrics'
  import { getMetricsSelectorGraph, filterSelectorGraph } from '@/metrics/utils'
  import Insights from './Insights/index.svelte'
  import Category from './Category.svelte'
  import Favorites from './Favorites.svelte'
  import ItemActions from './ItemActions.svelte'
  import Tabs from './Tabs.svelte'

  let input = ''
  let metrics: string[] = []
  let isMetricTab = true

  $: categories = Object.keys(graph) as MetricCategory[]
  $: graph = getMetricsSelectorGraph(metrics, $studio)
  $: loweredInput = input.toLowerCase()
  $: filteredGraph = loweredInput
    ? filterSelectorGraph(graph, loweredInput)
    : graph
  $: isFiltering = !!input

  queryProjectMetrics($studio.slug).then((items) => (metrics = items))

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
    if (!hoveredItem) return
    hoveredItem = null
    hoveredNode = null
  }
</script>

<aside>
  <div class="content column">
    <div class="top">
      <Tabs bind:isMetricTab />
      <div class="mrg-l mrg--t sidebar-project" />
      <div class="input border mrg-s mrg--t row v-center fluid">
        <Icon id="search" w="12" class="$style.search" />
        <input
          name=""
          type="text"
          on:input={onInput}
          placeholder="Search metrics" />
      </div>
    </div>
    <div class="categories" on:scroll={onItemLeave} on:mouseleave={onItemLeave}>
      {#if isMetricTab}
        <ItemActions node={hoveredNode} item={hoveredItem} {onItemLeave} />
        <Favorites {isFiltering} {onItemEnter} searchTerm={loweredInput} />
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
    <div class="toggle" />
  </div>
</aside>

<style>
  aside {
    width: 260px;
    background: var(--white);
    border-right: 1px solid var(--porcelain);
    z-index: 22;
  }

  .content {
    position: sticky;
    top: 0;
    height: 100vh;
  }

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
  }

  .search {
    position: absolute;
    left: 14px;
  }

  .categories {
    flex: 1;
    overflow: hidden;
  }

  .categories:hover {
    overflow-y: overlay;
  }

  .toggle {
    width: 12px;
    top: 0;
    bottom: 0;
    right: -1px;
    user-select: none;
    position: absolute;
    display: flex;
  }
</style>
