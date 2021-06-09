<script lang="ts">
  import Item from '../Item.svelte'
  import { getNodeController } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  const { checkIsMapviewDisabled } = getAdapterController()
  const NodeController = getNodeController()

  export let notable
  export let onItemEnter

  const onClick = (e) =>
    checkIsMapviewDisabled?.() || NodeController(notable, e)
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  on:mousewheel
  on:mouseleave
  on:click={onClick}
  onItemEnter={(node) => onItemEnter(node, notable)} />
