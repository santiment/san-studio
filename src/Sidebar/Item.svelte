<script lang="ts">
  import { onDestroy } from 'svelte'
  import ItemLabel from './ItemLabel.svelte'

  let className = ''
  export { className as class }
  export let item: any
  export let HoverItem
  export let active = false
  export let isShowingSubitems = true
  export let onItemEnter = undefined
  export let onLeave = undefined

  let hovered = null
  let hoverNode

  $: if (hoverNode) window.__clearHoverItem = clear

  const clear = () => ((hovered = null), onLeave?.())
  function onMouseEnter({ currentTarget }) {
    hovered = currentTarget
    setTimeout(() => currentTarget.nextElementSibling?.matches(':hover') || clear(), 15)
  }

  onDestroy(() => (window.__clearHoverItem = null))
</script>

<div
  class="item btn row v-center {className}"
  class:pro={item.isPro}
  class:active
  class:subitem={isShowingSubitems && item.submetricOf}
  on:mouseenter={HoverItem && onMouseEnter}
  on:click
>
  <slot>
    <ItemLabel {item} bind:active />
  </slot>
</div>

{#if HoverItem && hovered}
  <div
    bind:this={hoverNode}
    class:active
    class="item hovered btn row v-center {className}"
    on:mouseenter={onItemEnter}
    on:mouseleave={clear}
    on:mousewheel={clear}
    on:click
  >
    <svelte:component this={HoverItem} node={hovered} {item} {hoverNode} />
  </div>
{/if}

<style lang="scss">
  .item {
    padding: 6px 9px;
    min-height: 32px;
    position: relative;
    background: var(--white);
    z-index: 2;
    word-break: break-word;

    &:hover {
      background: var(--athens);
      color: var(--green);
      --fill: var(--white);
      --bg: var(--green);
    }
  }

  .pro {
    color: var(--orange);

    &:hover {
      color: var(--orange-hover);
      --bg: var(--orange);
    }
  }

  .subitem {
    margin-left: 24px;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 1;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: var(--porcelain);
      left: -15px;
      z-index: -2;
    }

    &::before {
      height: 100%;
      width: 1px;
      transform: translateY(-50%);
    }

    &::after {
      height: 1px;
      width: 16px;
    }
  }

  .active {
    color: var(--green);
  }

  .hovered {
    position: absolute;
    z-index: 3;
    box-shadow: 0px 2px 8px rgba(47, 53, 77, 0.16);

    &:hover {
      --bg: var(--green-light-2);
      --fill: var(--green);
      color: var(--green);
    }

    &.active {
      --bg: var(--red-light-1);
      --fill: var(--red);
      color: var(--color-active-hover, var(--red));
    }
  }
</style>
