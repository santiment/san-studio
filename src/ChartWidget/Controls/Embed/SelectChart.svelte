<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { studio } from '@/stores/studio'
  import { getWidgets } from '@/stores/widgets'
  import ChartPreview from './ChartPreview.svelte'
  import { getChartWidgetLabel } from './utils'

  const Widgets = getWidgets()
  const widgets = $Widgets.filter((widget) => !!widget.chart)

  export let charts

  let isOpened = false

  $: chart = charts[0]
  $: selected = charts.length === 1 ? chart : null

  let optionsRef
  $: if (optionsRef) {
    const activeNode = optionsRef.querySelector('.active')
    if (activeNode) {
      const { offsetTop, parentNode } = activeNode
      parentNode.scrollTop = offsetTop - parentNode.clientHeight / 2
    }
  }

  function onSelect(widget = widgets) {
    charts = Array.isArray(widget) ? widget : [widget]
    isOpened = false
  }
</script>

<Tooltip on="click" duration={0} align="left" bind:isOpened>
  <div slot="trigger" class="chart row border btn v-center mrg-l mrg--b">
    <span>
      {#if charts.length === 1}
        Chart #{widgets.indexOf(chart) + 1}: {getChartWidgetLabel(
          chart,
          $studio,
        )}
      {:else}
        All charts
      {/if}
    </span>

    <Svg id="arrow" w="8" h="4.5" class="mrg-a mrg--l $style.arrow" />
  </div>

  <div slot="tooltip" class="tooltip" bind:this={optionsRef}>
    <div
      class="all btn border"
      class:active={!selected}
      on:click={() => onSelect(widgets)}>
      All charts
    </div>
    {#each widgets as widget}
      <div
        class="option btn border mrg-m mrg--t"
        class:active={selected === widget}
        on:click={() => onSelect(widget)}>
        <ChartPreview {widget} />
      </div>
    {/each}
  </div>
</Tooltip>

<style>
  .chart {
    padding: 5px 10px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }
  .arrow {
    transform: rotate(180deg);
  }

  span {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tooltip {
    width: 256px;
    padding: 8px;
    overflow: auto;
    max-height: 360px;
  }

  .all {
    text-align: center;
    padding: 5px;
  }

  .option {
    height: 140px;
  }
  .active,
  .all:hover,
  .option:hover {
    border-color: var(--green);
  }
</style>
