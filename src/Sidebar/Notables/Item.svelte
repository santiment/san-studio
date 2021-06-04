<script lang="ts">
  import Item from '../Item.svelte'
  import { selectedMetrics } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  const { checkIsMapviewDisabled } = getAdapterController()

  export let notable
  export let onItemEnter

  const onClick = () =>
    checkIsMapviewDisabled?.() || selectedMetrics.toggle(notable)
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  on:mousewheel
  on:mouseleave
  on:click={onClick}
  onItemEnter={(node) => onItemEnter(node, notable)} />
