<script lang="ts">
  import { getContext } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { filterSelectorGraph } from '@/metrics/selector/utils'

  const availableMetricsGraph = getContext('availableMetricsRef').ref
  const categories = Object.keys(availableMetricsGraph)

  export let metrics: Studio.Metric[]
  export let onMetricSelect

  let isOpened
  let input = ''

  $: loweredInput = input.toLowerCase()
  $: metricsSet = new Set(metrics)
  $: filteredGraph = loweredInput
    ? filterSelectorGraph(availableMetricsGraph, loweredInput)
    : availableMetricsGraph
  $: if (!isOpened) input = ''
</script>

<!-- svelte-ignore a11y-autofocus -->
<Tooltip
  bind:isOpened
  on="click"
  position="left"
  duration={0}
  class="$style.tooltip"
  activeClass="$style.active">
  <div slot="trigger" class="btn border metric add">
    <Svg id="plus-circle" w="16" />
  </div>

  <svelte:fragment slot="tooltip">
    <input
      autofocus
      class="border fluid mrg-s mrg--b"
      name=""
      type="text"
      bind:value={input} />
    <div class="items">
      {#each categories as category}
        {#each filteredGraph[category] as item}
          {#if item.selectorType === undefined && !metricsSet.has(item)}
            <div
              class="item btn btn--ghost"
              on:click={() => onMetricSelect(item)}>
              {item.label}
            </div>
          {/if}
        {/each}
      {/each}
    </div>
  </svelte:fragment>
</Tooltip>

<style>
  .add {
    min-width: 32px;
    padding: 5px 7px;
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
  }

  .items {
    max-height: 300px;
    width: 300px;
    overflow-y: auto;
  }
</style>
