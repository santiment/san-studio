<script lang="ts">
  import ItemLabel from './ItemLabel.svelte'
  import ItemActions from './ItemActions.svelte'

  let className = ''
  export { className as class }
  export let item: any
  export let isShowingSubitems = true
  export let HoverItem = ItemActions
  export let onItemEnter = undefined
  export let onLeave = undefined

  let active
  let hovered = null

  const clear = () => (console.log('LEAVING'), (hovered = null), onLeave?.())
  function onMouseEnter({ currentTarget }) {
    hovered = currentTarget
    setTimeout(
      () => currentTarget.nextElementSibling?.matches(':hover') || clear(),
      10,
    )
  }
</script>

<div
  class="sidebar-item item row v-center {className}"
  class:pro={item.isPro}
  class:active
  class:subitem={isShowingSubitems && item.submetricOf}
  on:mouseenter={onMouseEnter}
  on:click>
  <ItemLabel {item} bind:active />
</div>

{#if hovered}
  <svelte:component
    this={HoverItem}
    node={hovered}
    {item}
    on:mouseenter={onItemEnter}
    on:mouseleave={clear}
    on:mousewheel={clear}
    on:click />
{/if}

<style>
  :global(.sidebar-item) {
    padding: 6px 9px;
    min-height: 32px;
    cursor: pointer;
    position: relative;
    user-select: none;
  }

  .item {
    z-index: 2;
    background: var(--white);
    border-radius: 4px;
  }
  .item:hover {
    background: var(--athens);
    color: var(--green);
    --fill: var(--white);
    --bg: var(--green);
  }

  .pro {
    color: var(--orange);
  }
  .pro:hover {
    color: var(--orange-hover);
    --bg: var(--orange);
  }

  .subitem {
    margin-left: 24px;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 1;
  }

  .subitem::before,
  .subitem::after {
    content: '';
    position: absolute;
    background: var(--porcelain);
    left: -15px;
    z-index: -2;
  }

  .subitem::before {
    height: 100%;
    width: 1px;
    transform: translateY(-50%);
  }

  .subitem::after {
    height: 1px;
    width: 16px;
  }

  .active {
    color: var(--green);
  }
</style>
