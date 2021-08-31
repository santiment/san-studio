<script lang="ts">
  import { tick } from 'svelte'
  import { getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg.svelte'
  import ItemLabel from './ItemLabel.svelte'
  import ItemDescription from './ItemDescription.svelte'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'

  const History = getHistoryContext()
  const { onAnonFavoriteClick } = getAdapterController()

  export let item: any
  export let node: HTMLElement | undefined
  export let hoverNode: HTMLElement | undefined

  let active = false

  $: style = node ? getActionsStyles() : ''
  $: if (hoverNode) hoverNode.setAttribute('style', style)
  $: isFavorited = item && $favoriteMetrics.has(item.key)

  function getActionsStyles() {
    const { left, width, height } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.sidebar-content')
    if (parent) top -= parent.scrollTop

    return `left:${left - 33}px;top:${top}px;--width:${
      width - 18
    }px;height:${height}px`
  }

  function onFavoriteClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    if ($globals.isLoggedIn) {
      const { key } = item
      favoriteMetrics.toggle(key)
      History.add('Toggle favorite', () => favoriteMetrics.toggle(key))

      const { offsetTop } = node
      const category = node.closest('.category')
      return tick().then(() => {
        const container = category.parentNode
        if (container.scrollTop < container.firstElementChild?.offsetHeight) {
          container.scrollTop += node.offsetTop - offsetTop
          style = getActionsStyles()
        }
      })
    }
    if (onAnonFavoriteClick) onAnonFavoriteClick()
  }
</script>

{#if style}
  <span class="row v-center">
    <ItemLabel {item} bind:active />
  </span>

  <ItemDescription {item} class="$style.icon" />

  {#if item.selectorType === undefined}
    <Svg
      id="star{isFavorited ? '-filled' : ''}"
      class="$style.icon $style.star mrg-m mrg--l {isFavorited
        ? '$style.favorited'
        : ''}"
      on:click={onFavoriteClick} />
  {/if}
{/if}

<style>
  span {
    width: var(--width);
  }

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
