<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip.svelte'
</script>

<Tooltip
  class="caption tooltip-dark $style.tooltip"
  position="top"
  align="center"
  duration={0}
  closeTimeout={0}>
  <div slot="trigger" class="btn live row hv-center mrg-a mrg--l" />

  <svelte:fragment slot="tooltip">Updated 6m ago</svelte:fragment>
</Tooltip>

<style>
  .live {
    width: 32px;
    height: 32px;
    --bg-hover: var(--green-light-1);
  }
  .live::before {
    content: '';
    display: block;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background: #26c953;
    border: 4px solid #c3e9d2;
  }

  .tooltip {
    white-space: nowrap;
  }
</style>
