<script lang="ts">
  import { queryLayout } from '@/api/layouts'
  import { selectedLayout } from '@/stores/layout'
  import HoverItem from './HoverItem.svelte'
  import Item from '../Item.svelte'

  export let item

  $: isActive = $selectedLayout && +item.id === +$selectedLayout?.id

  function onClick() {
    queryLayout(item.id).then(window.onLayoutSelect)
  }
</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="$style.item">
  {item.title}
</Item>

<style>
  .item {
    --color-active-hover: var(--green) !important;
  }
</style>
