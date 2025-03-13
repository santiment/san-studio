<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import Category from './../../../Sidebar/Category.svelte'
  import { SelectorNode } from './../../../metrics/selector'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  const items = [SelectorNode.btc_halving, SelectorNode.cancun_upgrade]
</script>

<Category category="Key Events" isOpened {isFiltering} {items} {onItemClick}>
  <svelte:fragment slot="pre-title">
    <Svg id="bell-filled" w="15" h="16" class="mrg-s mrg--r $style.icon" />
  </svelte:fragment>
</Category>

<style>
  .icon {
    fill: var(--purple) !important;
  }
</style>
