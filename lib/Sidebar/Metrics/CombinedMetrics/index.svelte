<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { getWidgets } from './../../../stores/widgets'
  import { selectedItems } from './../../../stores/selector'
  import { widgetsListener } from './../../../stores/widgetsListener'
  import Category from './../../../Sidebar/Category.svelte'
  import Item from './../../../Sidebar/Item.svelte'
  import { showCombineDialog } from './../../../CombineDialog/index.svelte'
  import HoverItem from './HoverItem.svelte'
  import { checkIsFilterMatch } from './../../../metrics/selector/utils'

  const Widgets = getWidgets()
  const unsubWidgets = widgetsListener.subscribe(onWidgetsChange)

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  let metrics = [] as any[]
  let MetricWidgets = new Map()

  $: searchedMetrics = searchTerm ? searchMetrics() : metrics

  function searchMetrics() {
    return metrics.filter((metric) => checkIsFilterMatch(searchTerm, metric))
  }

  setContext('updateCombinedMetrics', updateMetrics)
  function updateMetrics(metric) {
    metrics = metrics
    MetricWidgets.get(metric)?.forEach(({ Metrics }) => {
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
      <Svg id="fx" w="16" h="15" class="mrg-s mrg--r $style.icon" />
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

    {#each searchedMetrics as item}
      <Item {item} {HoverItem} on:click={(e) => onItemClick(e, item)} />
    {:else}
      <div class="mrg-s mrg--l c-waterloo">Create brand new metric composites</div>
    {/each}
  </Category>
{/if}

<style lang="scss">
  .icon {
    fill: var(--blue) !important;
  }

  .btn {
    --fill: var(--waterloo);
    --fill-hover: var(--green);

    &:hover + :global(svg) {
      fill: var(--waterloo);
    }
  }
</style>
