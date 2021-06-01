<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  export let error
</script>

<Tooltip
  class="caption tooltip-dark"
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
  :global(.tooltip-dark) {
    background: #505573 !important;
    color: #fff;
    padding: 5px 12px;
    max-width: 310px;
  }
</style>
