<script lang="ts">
  import { getWidgets } from '@/stores/widgets'

  import Svg from 'webkit/ui/Svg/svelte'
  import { getSortableDndCtx } from './dnd'
  const sortableDndCtx = getSortableDndCtx()
  const Widgets = getWidgets()

  let className = ''
  export { className as class }
  export let widget
  export let isBlocked = false
  export let isMetricsPhase = false

  let node
  $: node && sortableDndCtx.addItem(node)

  function onDeleteClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    widget.delete()
  }
</script>

<div
  bind:this={node}
  on:click
  class="preview border {className}"
  class:apply={isMetricsPhase}
  class:blocked={isBlocked}>
  <slot />

  {#if widget && $Widgets.length > 1}
    <div class="btn-2 btn-3 delete" on:click={onDeleteClick}>
      <Svg id="delete" w="16" />
    </div>
  {/if}
</div>

<style>
  .preview {
    height: 240px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
  }

  :global(.preview-info),
  .preview::after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .preview::after {
    opacity: 0;
    content: 'Click to zoom into chart';
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 27, 43, 0.84);
    color: #fff;
    transition: opacity 0.2s ease-in-out;
    border-radius: 8px;
  }
  .preview:hover::after {
    opacity: 1;
  }

  .apply::after {
    content: 'Click to apply selected metrics';
  }

  .blocked {
    pointer-events: none;
  }
  .blocked::after {
    opacity: 1;
    content: "New metrics can't be added to this widget";
  }

  .delete {
    display: none;
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    --bg: var(--white);
    --fill: var(--red);
    --fill-hover: var(--red-hover);
  }

  .preview:hover .delete {
    display: inline-flex;
  }
</style>
