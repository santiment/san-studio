<script context="module">
  import { getAppTooltipCtx } from 'san-webkit/lib/ui/Tooltip/ctx'

  const ID = 'MetricErrorTooltipCtx'
  export const getMetricErrorTooltip = () => getAppTooltipCtx(ID)
</script>

<script>
  import Context from 'san-webkit/lib/ui/Tooltip/Context.svelte'

  const settings = {
    dark: true,
    align: 'center',
    position: 'top',
    closeTimeout: 0,
    class: 'caption dark tooltip-_UAYFp',
  }
</script>

<Context id={ID} {settings}>
  <slot />

  <svelte:fragment slot="tooltip" let:props>
    {props.error}
  </svelte:fragment>
</Context>

<style>
  :global(.tooltip-_UAYFp) {
    max-width: 310px;
    z-index: 24;
  }
</style>
