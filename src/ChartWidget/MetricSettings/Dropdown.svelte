<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'

  let optionsNode
  $: if (optionsNode) {
    const activeNode = optionsNode.querySelector('.active')
    if (activeNode) {
      const { offsetTop, parentNode } = activeNode
      parentNode.scrollTop = offsetTop - parentNode.clientHeight / 2
    }
  }
</script>

<Tooltip on="click" duration={0} align="center">
  <div slot="trigger" class="setting row v-center mrg-l mrg--l btn">
    <slot />
    <Icon id="arrow" w="8" h="4.5" class="mrg-s mrg--l $style.arrow" />
  </div>

  <div
    slot="tooltip"
    class="dropdown body-3 column"
    class:scroll={$$slots.options}
    bind:this={optionsNode}>
    <slot name="dropdown" />
    <slot name="options" />
  </div>
</Tooltip>

<style>
  .setting {
    height: 22px;
    border-bottom: 1px dashed var(--mystic);
    --color: var(--waterloo);
    --fill-hover: var(--green);
  }

  .arrow {
    transform: rotate(180deg);
  }

  .dropdown {
    padding: 8px;
    max-height: 195px;
    font-weight: 400;
  }

  .scroll {
    overflow-y: auto;
    scrollbar-width: thin;
  }

  :global(.btn--ghost.active) {
    --color: var(--green);
  }

  .dropdown :global(.btn) {
    white-space: nowrap;
  }
</style>
