<script lang="ts">
  import Item from '../Item.svelte'
  import { selectedMetrics } from '@/stores/selector'

  export let notable
  export let onItemEnter

  function onClick() {
    selectedMetrics.toggle(notable)
  }
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  on:mousewheel
  on:mouseleave
  on:click={onClick}
  onItemEnter={(node) => onItemEnter(node, notable)} />
