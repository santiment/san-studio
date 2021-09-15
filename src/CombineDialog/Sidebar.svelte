<script lang="ts">
  import { queryProjectMetrics } from '@/api/metrics'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { getMetricsSelectorGraph } from '@/metrics/selector/utils'
  import { convertBaseProjectMetric } from '@/ChartWidget/Metrics/utils'
  import Search from '@/Sidebar/Search.svelte'
  import VirtualList from './VirtualList.svelte'
  import ProjectSelector from './ProjectSelector.svelte'

  export let onMetricSelect

  let availableMetrics = [] as any[]
  let searchTerm = ''
  let project

  $: ({ slug } = $studio)
  $: queryProjectMetrics(project?.slug || slug).then(
    (items) => (availableMetrics = items),
  )
  $: graph = getMetricsSelectorGraph(
    availableMetrics,
    Object.assign({}, $globals, project || $studio),
  )
  $: items = (searchTerm, getItems(graph))

  const itemsFilter = ({ selectorType, label }) =>
    selectorType === undefined && label.toLowerCase().includes(searchTerm)
  function getItems(graph) {
    const items = Object.values(graph).flat()
    return searchTerm ? items.filter(itemsFilter) : items
  }

  function onSelect(metric) {
    onMetricSelect(project ? convertBaseProjectMetric(metric, project) : metric)
  }
</script>

<div class="sidebar column">
  <ProjectSelector class="mrg-s mrg--b" bind:project />

  <Search
    class="mrg-s mrg--b"
    autofocus
    placeholder="Search metrics"
    bind:searchTerm />

  <VirtualList class="$style.items" {items} let:item>
    <div class="item btn btn--ghost" on:click={() => onSelect(item)}>
      {item.label}
    </div>
  </VirtualList>
</div>

<style>
  .sidebar {
    padding: 12px 20px 0;
    border-right: 1px solid var(--porcelain);
    align-self: stretch;
    width: 280px;
  }

  .items {
    overflow-y: auto;
    height: 100%;
  }
</style>
