<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import ItemLabel from './ItemLabel.svelte'
  import ItemDescription from './ItemDescription.svelte'
  import { getNodeController } from '@/stores/selector'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  const NodeController = getNodeController()
  const { onAnonFavoriteClick } = getAdapterController()

  export let item: any
  export let node: any
  export let onItemLeave

  let active = false
  let style = ''
  $: if (node) {
    const { left, width, height } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.categories')
    if (parent) top -= parent.scrollTop

    style = `left:${left}px;top:${top}px;--width:${
      width - 18
    }px;height:${height}px`
  } else {
    style = ''
  }

  $: isFavorited = item && $favoriteMetrics.has(item.key)

  function onFavoriteClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    if ($globals.isLoggedIn) return favoriteMetrics.toggle(item.key)
    if (onAnonFavoriteClick) onAnonFavoriteClick()
  }
</script>

{#if style}
  <div
    {style}
    class:active
    class="sidebar-item menu row v-center"
    on:click={() => NodeController(item)}
    on:mouseleave={onItemLeave}
    on:mousewheel={onItemLeave}>
    <span class="row v-center">
      <ItemLabel {item} bind:active />
    </span>

    {#key item.key}
      <ItemDescription {item} class="$style.icon" />
    {/key}

    {#if item.selectorType === undefined}
      <Icon
        id="star{isFavorited ? '-filled' : ''}"
        class="$style.icon $style.star mrg-m mrg--l {isFavorited
          ? '$style.favorited'
          : ''}"
        on:click={onFavoriteClick} />
    {/if}
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    border-radius: 4px;
    background: var(--athens);
    box-shadow: 0px 2px 8px rgba(47, 53, 77, 0.16);
    z-index: 3;
  }
  .menu:hover {
    --bg: var(--green-light-2);
    --fill: var(--green);
    color: var(--green);
  }
  .active:hover {
    --bg: var(--red-light-1);
    --fill: var(--red);
    color: var(--red);
  }

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
