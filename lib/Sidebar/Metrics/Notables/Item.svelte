<script lang="ts">
  import Item from './../../../Sidebar/Item.svelte'
  import HoverItem from '../HoverItem.svelte'

  export let notable
  export let onItemClick, onItemEnter, onLeave
</script>

<Item
  item={notable.metric}
  isShowingSubitems={false}
  class="sidebar-menu"
  {HoverItem}
  {onLeave}
  on:mousewheel
  on:click={(e) => onItemClick(e, notable)}
  onItemEnter={(e) => onItemEnter(e.currentTarget, notable)}
/>
