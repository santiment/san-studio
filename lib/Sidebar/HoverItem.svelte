<script lang="ts">
  export let node
  export let hoverNode

  $: style = node ? getActionsStyles() : ''

  $: if (hoverNode) hoverNode.setAttribute('style', style)

  function getActionsStyles() {
    if (!node) return
    const { width, height } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.sidebar-content')
    if (parent) top -= parent.scrollTop
    return `left:${node.offsetLeft}px;top:${top}px;--width:${width - 18}px;height:${height}px`
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
