<script lang="ts">import { queryProjectMetrics } from './../../lib/api/metrics';
import { studio } from './../../lib/stores/studio';
import { globals } from './../../lib/stores/globals';
import { getMetricsSelectorGraph } from './../../lib/metrics/selector/utils';
import { convertBaseProjectMetric } from './../../lib/ChartWidget/Metrics/utils';
import Search from './../../lib/Sidebar/Search.svelte';
import VirtualList from './VirtualList.svelte';
import ProjectSelector from './ProjectSelector.svelte';
export let onMetricSelect;
let availableMetrics = [];
let searchTerm = '';
let project;

$: ({
  slug
} = $studio);

$: queryProjectMetrics((project === null || project === void 0 ? void 0 : project.slug) || slug).then(items => availableMetrics = items);

$: graph = getMetricsSelectorGraph(availableMetrics, Object.assign({}, $globals, project || $studio));

$: items = (searchTerm, getItems(graph));

const selectorTypeFilter = ({
  selectorType
}) => selectorType === undefined;

const itemsFilter = ({
  selectorType,
  label
}) => selectorType === undefined && label.toLowerCase().includes(searchTerm);

function getItems(graph) {
  const items = Object.values(graph).flat();
  return items.filter(searchTerm ? itemsFilter : selectorTypeFilter);
}

function onSelect(metric) {
  onMetricSelect(project ? convertBaseProjectMetric(metric, project) : metric);
}</script>

<div class="sidebar column">
  <ProjectSelector class="mrg-s mrg--b" bind:project />

  <Search class="mrg-s mrg--b" autofocus placeholder="Search metrics" bind:searchTerm />

  <VirtualList class="items-h4kTCI" {items} let:item>
    <div class="item btn-ghost" on:click={() => onSelect(item)}>
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

  :global(.items-h4kTCI) {
    overflow-y: auto;
    height: 100%;
  }
</style>
