<script lang="ts">
  import Item from '../Item.svelte'

  export let notable
  export let onItemClick, onItemEnter
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  on:mousewheel
  on:mouseleave
  on:click={(e) => onItemClick(e, notable)}
  onItemEnter={(node) => onItemEnter(node, notable)} />
