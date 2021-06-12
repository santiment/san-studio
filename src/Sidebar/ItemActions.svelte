<script lang="ts">
  import { tick } from 'svelte'
  import Icon from 'webkit/ui/Icon.svelte'
  import ItemLabel from './ItemLabel.svelte'
  import ItemDescription from './ItemDescription.svelte'
  import { getNodeController } from '@/stores/selector'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  const NodeController = getNodeController()
  const { checkIsMapviewDisabled, onAnonFavoriteClick } = getAdapterController()

  export let item: any
  export let node: any
  export let onItemEnter
  export let onItemLeave

  let actionsNode
  let active = false

  $: style = node ? getActionsStyles() : ''
  $: isFavorited = item && $favoriteMetrics.has(item.key)

  function getActionsStyles() {
    const { left, width, height } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.categories')
    if (parent) top -= parent.scrollTop

    return `left:${left}px;top:${top}px;--width:${
      width - 18
    }px;height:${height}px`
  }

  function onFavoriteClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    if ($globals.isLoggedIn) {
      favoriteMetrics.toggle(item.key)

      const { offsetTop } = node
      const _node = node
      const _item = item
      const parent = node.closest('.category')

      return tick().then(() => {
        const categoriesNode = actionsNode.parentNode
        const { nextElementSibling } = actionsNode

        const favoritesNode =
          nextElementSibling?.classList.contains('favorites') &&
          nextElementSibling

        if (favoritesNode === parent) return onItemLeave()

        if (categoriesNode.scrollTop < favoritesNode?.offsetHeight) {
          categoriesNode.scrollTop += node.offsetTop - offsetTop
        }

        requestAnimationFrame(() => onItemEnter(_node, _item))
      })
    }
    if (onAnonFavoriteClick) onAnonFavoriteClick()
  }

  const onClick = (e) => checkIsMapviewDisabled?.() || NodeController(item, e)
</script>

{#if style}
  <div
    {style}
    bind:this={actionsNode}
    class:active
    class="sidebar-item sidebar-menu menu row v-center"
    on:click={onClick}
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
    z-index: 3;
  }

  :global(.sidebar-menu) {
    border-radius: 4px;
    background: var(--athens);
  }
  :global(.sidebar-item.sidebar-menu:hover) {
    box-shadow: 0px 2px 8px rgba(47, 53, 77, 0.16);
    --bg: var(--green-light-2);
    --fill: var(--green);
    color: var(--green);
    z-index: 3;
  }
  :global(.sidebar-menu.active:hover) {
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
