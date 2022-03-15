<script context="module">
  import { getContext } from 'svelte'

  const ID = 'MetricErrorTooltipCtx'
  export const getMetricErrorTooltip = () => getContext(ID)
</script>

<script>
  import Context from 'webkit/ui/Tooltip/Context.svelte'

  const settings = {
    dark: true,
    align: 'center',
    position: 'top',
    closeTimeout: 0,
    class: 'caption dark $style.tooltip',
  }
</script>

<Context id={ID} {settings}>
  <slot />

  <svelte:fragment slot="tooltip" let:props>
    {props.error}
  </svelte:fragment>
</Context>

<style>
  .tooltip {
    max-width: 310px;
    z-index: 24;
  }
</style>
