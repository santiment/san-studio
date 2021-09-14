<script lang="ts">
  import { onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { queryProjectMetrics } from '@/api/metrics'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import {
    getMetricsSelectorGraph,
    filterSelectorGraph,
  } from '@/metrics/selector/utils'
  import { convertBaseProjectMetric } from '@/ChartWidget/Metrics/utils'
  import VirtualList from './VirtualList.svelte'

  export let metrics: Studio.Metric[]
  export let onMetricSelect

  let availableMetrics = [] as any[]
  let isOpened
  let input = ''
  let inputRef
  let project = { slug: 'bitcoin', ticker: 'BTC' }
  let projectNode

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

  window.onCombineProjectSelect = (newProject) => {
    if (!newProject || newProject.slug === slug) return (project = undefined)
    project = newProject
  }

  onDestroy(() => {
    window.onCombineProjectSelect = undefined
  })
</script>

<!-- svelte-ignore a11y-autofocus -->
<Tooltip
  bind:isOpened
  on="click"
  position="left"
  duration={0}
  class="$style.tooltip"
  activeClass="$style.active">
  <div slot="trigger" class="btn border metric add row hv-center">
    <Svg id="plus-circle" w="16" />
  </div>

  <svelte:fragment slot="tooltip">
    <div class="project mrg-s mrg--b border" bind:this={projectNode} />

    <input
      bind:this={inputRef}
      autofocus
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
      <div class="items">
        {#each items as item}
          {#if item.selectorType === undefined}
            <div class="item btn btn--ghost" on:click={() => onSelect(item)}>
              {item.label}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </svelte:fragment>
</Tooltip>

<style>
  .add {
    min-width: 32px;
    margin: 0 0 8px 8px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }
  .add.active {
    fill: var(--green);
    --bg: var(--green-light-1);
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
    max-height: 300px;
    width: 300px;
    overflow-y: auto;
    height: 300px;
  }

  .project {
    height: 32px;
  }
</style>
