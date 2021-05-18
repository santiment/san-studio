<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'

  let optionsNode
  $: if (optionsNode) {
    const activeNode = optionsNode.querySelector('.active')
    if (activeNode) {
      const { offsetTop } = activeNode
      optionsNode.scrollTop = offsetTop - optionsNode.clientHeight / 2
    }
  }
</script>

<Tooltip on="click" duration={0} align="center">
  <div slot="trigger" class="setting row v-center mrg-l mrg--l btn">
    <slot />
    <Icon id="arrow" w="8" h="4.5" class="mrg-s mrg--l $style.arrow" />
  </div>

  <div slot="tooltip" class="dropdown body-3" bind:this={optionsNode}>
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
    overflow: auto;
    max-height: 195px;
    font-weight: 400;
  }

  :global(.btn--ghost.active) {
    --color: var(--green);
  }
</style>
