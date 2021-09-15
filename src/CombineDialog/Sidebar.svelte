<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { queryProjectMetrics } from '@/api/metrics'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { getMetricsSelectorGraph } from '@/metrics/selector/utils'
  import { convertBaseProjectMetric } from '@/ChartWidget/Metrics/utils'
  import VirtualList from './VirtualList.svelte'
  import { queryAllProjects } from '@/api/project'

  export let metrics: Studio.Metric[]
  export let onMetricSelect

  let availableMetrics = [] as any[]
  let isOpened
  let input = ''
  let inputRef
  let project = { slug: 'bitcoin', ticker: 'BTC' }
  let projectNode

  let projects = []
  //queryAllProjects().then((items) => (projects = items))

  $: ({ slug } = $studio)
  $: queryProjectMetrics(project?.slug || slug).then(
    (items) => (availableMetrics = items),
  )
  $: graph = getMetricsSelectorGraph(
    availableMetrics,
    Object.assign({}, $globals, project || $studio),
  )
  $: loweredInput = input.toLowerCase()
  $: if (!isOpened) input = ''
  $: projectNode && window.renderCombineProjectSelector?.(projectNode)
  $: items = (loweredInput, getItems(graph))

  const itemsFilter = ({ selectorType, label }) =>
    selectorType === undefined && label.toLowerCase().includes(loweredInput)
  function getItems(graph) {
    const items = Object.values(graph).flat()
    return items.filter(itemsFilter)
  }

  function onSelect(metric) {
    onMetricSelect(project ? convertBaseProjectMetric(metric, project) : metric)
    inputRef?.focus()
  }

  function onProjectSelect(newProject) {
    if (!newProject || newProject.slug === slug) return (project = undefined)
    project = newProject
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<div class="sidebar column">
  <div class="project mrg-s mrg--b border" bind:this={projectNode} />

  <input
    bind:this={inputRef}
    class="border fluid mrg-s mrg--b"
    name=""
    type="text"
    placeholder="Search metrics"
    bind:value={input} />

  <VirtualList class="$style.items" {items} let:item>
    <div class="item btn btn--ghost" on:click={() => onSelect(item)}>
      {item.label}
    </div>
  </VirtualList>

  {#if false}
    <VirtualList class="$style.items" {items} let:item>
      <div class="item btn btn--ghost" on:click={() => onSelect(item)}>
        <img
          alt="Ethereum"
          src="https://production-sanbase-images.s3.amazonaws.com/uploads/logo64_{item.slug}.png" />
        {item.name} ({item.ticker})
      </div>
    </VirtualList>
  {/if}
</div>

<style>
  .sidebar {
    padding: 12px 20px 0;
    border-right: 1px solid var(--porcelain);
    align-self: stretch;
    width: 280px;
  }

  .tooltip {
    margin-left: -8px;
    padding: 8px;
  }

  input {
    padding: 5px 8px;
    color: var(--black);
  }

  .items {
    overflow-y: auto;
    height: 100%;
  }

  .project {
    height: 32px;
  }

  img {
    height: 16px;
    width: 16px;
  }
</style>
