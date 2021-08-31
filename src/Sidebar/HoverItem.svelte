<script lang="ts">
  export let node: HTMLElement | undefined
  export let hoverNode: HTMLElement | undefined

  $: style = node ? getActionsStyles() : ''
  $: if (hoverNode) hoverNode.setAttribute('style', style)

  function getActionsStyles() {
    const { left, width, height } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.sidebar-content')
    if (parent) top -= parent.scrollTop

    return `left:${left - 33}px;top:${top}px;--width:${
      width - 18
    }px;height:${height}px`
  }
</script>

{#if style}
  <span class="row v-center">
    <slot />
  </span>

  <slot name="right" />
{/if}

<style>
  span {
    width: var(--width);
  }
</style>
