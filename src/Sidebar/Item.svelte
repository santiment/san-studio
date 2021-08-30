<script lang="ts">
  import ItemLabel from './ItemLabel.svelte'

  let className = ''
  export { className as class }
  export let item: any
  export let HoverItem
  export let isShowingSubitems = true
  export let onItemEnter = undefined
  export let onLeave = undefined

  let active
  let hovered = null
  let hoverNode

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
  class="item btn row v-center {className}"
  class:pro={item.isPro}
  class:active
  class:subitem={isShowingSubitems && item.submetricOf}
  on:mouseenter={HoverItem && onMouseEnter}
  on:click>
  <ItemLabel {item} bind:active />
</div>

{#if HoverItem && hovered}
  <div
    bind:this={hoverNode}
    class:active
    class="item hovered btn row v-center"
    on:mouseenter={onItemEnter}
    on:mouseleave={clear}
    on:mousewheel={clear}
    on:click>
    <svelte:component this={HoverItem} node={hovered} {item} {hoverNode} />
  </div>
{/if}

<style>
  .item {
    padding: 6px 9px;
    min-height: 32px;
    position: relative;
    background: var(--white);
    z-index: 2;
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

  .hovered {
    position: absolute;
    z-index: 3;
    box-shadow: 0px 2px 8px rgba(47, 53, 77, 0.16);
  }
  .hovered:hover {
    --bg: var(--green-light-2);
    --fill: var(--green);
    color: var(--green);
  }
  .hovered.active {
    --bg: var(--red-light-1);
    --fill: var(--red);
    color: var(--red);
  }
</style>
