<script lang="ts">
  import { tick } from 'svelte'
  import { getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg/svelte'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import HoverItem from '@/Sidebar/HoverItem.svelte'
  import ItemLabel from '../ItemLabel.svelte'
  import ItemDescription from '../ItemDescription.svelte'

  const History = getHistoryContext()
  const { onAnonFavoriteClick } = getAdapterController()

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let active = false

  $: isFavorited = item && $favoriteMetrics.has(item.key)

  function onFavoriteClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    if ($globals.isLoggedIn) {
      const { key } = item
      favoriteMetrics.toggle(key)
      History.add('Toggle favorite', () => favoriteMetrics.toggle(key))

      const { offsetTop } = node
      const category = node.closest('.category') as HTMLElement
      return tick().then(() => {
        const container = category.parentNode as HTMLElement
        if (container.scrollTop < container.firstElementChild?.offsetHeight) {
          container.scrollTop += node.offsetTop - offsetTop
        }
      })
    }
    if (onAnonFavoriteClick) onAnonFavoriteClick()
  }
</script>

<HoverItem {node} {hoverNode}>
  <ItemLabel {item} bind:active />

  <svelte:fragment slot="right">
    <ItemDescription {item} class="$style.icon" />

    {#if item.selectorType === undefined}
      <Svg
        id="star{isFavorited ? '-filled' : ''}"
        class="$style.icon $style.star mrg-m mrg--l {isFavorited
          ? '$style.favorited'
          : ''}"
        on:click={onFavoriteClick} />
    {/if}
  </svelte:fragment>
</HoverItem>

<style>
  .icon {
    width: 16px;
    height: 16px;
    fill: var(--waterloo);
  }

  .star:hover {
    fill: var(--orange);
  }

  .favorited {
    fill: var(--orange);
  }
  .favorited:hover {
    fill: var(--orange-hover);
  }
</style>
