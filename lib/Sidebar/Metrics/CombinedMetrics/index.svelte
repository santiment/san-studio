<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { getWidgets } from './../../../../lib/stores/widgets'
  import { selectedItems } from './../../../../lib/stores/selector'
  import { widgetsListener } from './../../../../lib/stores/widgetsListener'
  import Category from './../../../../lib/Sidebar/Category.svelte'
  import Item from './../../../../lib/Sidebar/Item.svelte'
  import { showCombineDialog } from './../../../../lib/CombineDialog/index.svelte'
  import HoverItem from './HoverItem.svelte'
  import { checkIsFilterMatch } from './../../../../lib/metrics/selector/utils'
  const Widgets = getWidgets()
  const unsubWidgets = widgetsListener.subscribe(onWidgetsChange)
  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick
  let metrics = []
  let MetricWidgets = new Map()

  $: searchedMetrics = searchTerm ? searchMetrics() : metrics

  function searchMetrics() {
    return metrics.filter((metric) => checkIsFilterMatch(searchTerm, metric))
  }

  setContext('updateCombinedMetrics', updateMetrics)

  function updateMetrics(metric) {
    var _a

    metrics = metrics
    ;(_a = MetricWidgets.get(metric)) === null || _a === void 0
      ? void 0
      : _a.forEach(({ Metrics }) => {
          Metrics.set(Metrics.getValue())
        })
  }

  function onAdd() {
    showCombineDialog({
      metrics: [],
    }).then((metric) => {
      if (!metric) return
      selectedItems.toggle(metric)
    })
  }

  function onWidgetsChange() {
    MetricWidgets = new Map()
    const linked = new Set()
    metrics = Widgets.get().flatMap((widget) => {
      if (!widget.metrics) return []
      return widget.metrics
        .filter((metric) => {
          if (!metric.expression) return
          const { base = metric } = metric
          if (linked.has(base)) return
          linkMetricWidget(base, widget)
          linked.add(base)
          return metric
        })
        .map((metric) => metric.base || metric)
    })
  }

  function linkMetricWidget(metric, widget) {
    let widgets = MetricWidgets.get(metric)
    if (!widgets) MetricWidgets.set(metric, (widgets = []))
    widgets.push(widget)
  }

  onDestroy(unsubWidgets)
</script>

{#if !isFiltering || (isFiltering && searchedMetrics.length)}
  <Category category="Combined metrics" isOpened {isFiltering} arrowClass="mrg-l">
    <svelte:fragment slot="pre-title">
      <Svg id="fx" w="16" h="15" class="mrg-s mrg--r icon-+P0Scq" />
    </svelte:fragment>

    <svelte:fragment slot="post-title">
      <button
        class="btn mrg-a mrg--l expl-tooltip row hv-center"
        aria-label="Add"
        on:click|stopPropagation={onAdd}
      >
        <Svg id="plus" w="10" />
      </button>
    </svelte:fragment>

    {#each searchedMetrics as item (item.key)}
      <Item {item} {HoverItem} on:click={(e) => onItemClick(e, item)} />
    {:else}
      <div class="mrg-s mrg--l c-waterloo">Create brand new metric composites</div>
    {/each}
  </Category>
{/if}

<style lang="scss">
  :global(.icon-\+P0Scq) {
    fill: var(--blue) !important;
  }

  .btn {
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }
  .btn:hover + :global(svg) {
    fill: var(--waterloo);
  }
</style>
