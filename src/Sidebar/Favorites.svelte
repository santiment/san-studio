<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { SelectorNode } from '@/metrics/selector'
  import { checkIsFilterMatch } from '@/metrics/selector/utils'
  import Category from './Category.svelte'
  import Item from './Item.svelte'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemEnter

  $: favorites = getFavorites($favoriteMetrics, searchTerm)

  function getFavorites(favoritesSet, searchTerm: string) {
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
      <Svg id="star-filled" w="16" class="mrg-s mrg--r $style.star" />
    </svelte:fragment>

    {#each favorites as item}
      <Item {item} {onItemEnter} isShowingSubitems={false} />
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

  .star {
    fill: var(--orange);
  }
</style>
