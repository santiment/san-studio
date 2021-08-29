<script lang="ts">
  import Item from '@/Sidebar/Item.svelte'

  export let notable
  export let onItemClick, onItemEnter, onLeave
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  on:mousewheel
  {onLeave}
  on:click={(e) => onItemClick(e, notable)}
  onItemEnter={(e) => onItemEnter(e.currentTarget, notable)} />
