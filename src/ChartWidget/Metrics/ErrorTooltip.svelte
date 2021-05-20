<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  export let error
</script>

<Tooltip
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
    background: #505573 !important;
    color: #fff;
    padding: 5px 12px;
    max-width: 310px;
  }
</style>
