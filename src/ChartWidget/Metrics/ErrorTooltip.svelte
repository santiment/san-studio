<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  export let error
</script>

<Tooltip
  dark
  class="caption $style.tooltip"
  isEnabled={!!error}
  position="top"
  align="center"
  duration={0}
  closeTimeout={0}>
  <slot slot="trigger" />

  <svelte:fragment slot="tooltip">
    {error}
  </svelte:fragment>
</Tooltip>

<style>
  .tooltip {
    max-width: 310px;
    z-index: 24;
  }
</style>
