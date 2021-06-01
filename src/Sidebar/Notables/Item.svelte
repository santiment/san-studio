<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import ChartPreview from './ChartPreview.svelte'
  import Item from '../Item.svelte'
  import { selectedMetrics } from '@/stores/selector'

  export let notable
  export let settings

  function onClick() {
    selectedMetrics.toggle(notable)
  }
</script>

<Tooltip
  class="$style.tooltip"
  position="right"
  align="center"
  openDelay={140}
  duration={0}>
  <Item
    slot="trigger"
    item={notable.metric}
    isShowingSubitems={false}
    class="sidebar-menu"
    on:click={onClick} />

  <svelte:fragment slot="tooltip">
    <ChartPreview {settings} {...notable} />
  </svelte:fragment>
</Tooltip>

<style>
  .tooltip {
    width: 320px;
    height: 152px;
    padding: 18px 24px;
  }
</style>
