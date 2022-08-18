<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { favoriteMetrics } from './../../../lib/stores/favoriteMetrics'
  import { SelectorNode } from './../../../lib/metrics/selector'
  import { checkIsFilterMatch } from './../../../lib/metrics/selector/utils'
  import Category from './../../../lib/Sidebar/Category.svelte'
  import Item from './../../../lib/Sidebar/Item.svelte'
  import HoverItem from './HoverItem.svelte'
  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  $: favorites = getFavorites($favoriteMetrics, searchTerm)

  function getFavorites(favoritesSet, searchTerm) {
    const favorites = []
    let i = 0
    favoritesSet.forEach((favoriteKey) => {
      const item = SelectorNode[favoriteKey]

      if (item && (searchTerm ? checkIsFilterMatch(searchTerm, item) : true)) {
        favorites[i++] = item
      }
    })
    return favorites
  }
</script>

{#if !isFiltering || (isFiltering && favorites.length)}
  <Category category="Favorites" {isFiltering} isOpened class="favorites">
    <svelte:fragment slot="pre-title">
      <Svg id="star-filled" w="16" class="mrg-s mrg--r star-kenTtJ" />
    </svelte:fragment>

    {#each favorites as item}
      <Item {item} {HoverItem} isShowingSubitems={false} on:click={(e) => onItemClick(e, item)} />
    {:else}
      <div>Save any metric to 'Favorites' for quick access</div>
    {/each}
  </Category>
{/if}

<style>
  div {
    color: var(--waterloo);
    padding-left: 8px;
  }

  :global(.star-kenTtJ) {
    fill: var(--orange);
  }
</style>
