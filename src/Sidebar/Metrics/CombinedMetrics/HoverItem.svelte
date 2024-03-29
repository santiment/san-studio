<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { getHistoryContext } from '@/history/ctx'
  import HoverItem from '@/Sidebar/HoverItem.svelte'
  import ItemLabel from '@/Sidebar/ItemLabel.svelte'
  import { showCombineDialog } from '@/CombineDialog/index.svelte'
  import Metric from '@/CombineDialog/Metric.svelte'
  import { getContext } from 'svelte'
  import { updateCombinedMetric } from '@/CombineDialog/flow'

  const History = getHistoryContext()
  const updateMetrics = getContext('updateCombinedMetrics')

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let active = false

  function onEditClick() {
    showCombineDialog({ metric: item }).then((updatedMetric) => {
      if (!updatedMetric) return

      updateCombinedMetric(item, updatedMetric, {
        History,
        onUpdate,
      })
    })
  }

  function onUpdate() {
    updateMetrics(item)
  }
</script>

<HoverItem {node} {hoverNode}>
  <ItemLabel {item} bind:active />

  <svelte:fragment slot="right">
    <Tooltip position="right" align="center" openDelay={110}>
      <div slot="trigger" class="btn mrg-m mrg--r">
        <Svg id="info" w="16" />
      </div>

      <div slot="tooltip" class="description c-black">
        <div class="txt-m">Expression</div>
        <p class="c-waterloo">{item.expression}</p>

        <div class="txt-m">Metrics</div>
        <div class="metrics row">
          {#each item.baseMetrics as metric, i}
            <Metric {i} {metric} />
          {/each}
        </div>
      </div>
    </Tooltip>

    <div class="edit btn" on:click|stopPropagation={onEditClick}>
      <Svg id="pencil" w="16" />
    </div>
  </svelte:fragment>
</HoverItem>

<style>
  .btn {
    --bg: none;
    --fill: var(--waterloo);
  }

  .edit {
    --fill-hover: var(--green);
  }

  .description {
    max-width: 400px;
    width: 340px;
    z-index: 1000;
    padding: 18px 24px;
  }

  p {
    margin: 3px 0 12px;
  }

  .metrics {
    flex-wrap: wrap;
    margin: 4px 0 -8px -8px;
  }
</style>
