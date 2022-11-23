<script context="module">import { getContext } from 'svelte';
const ID = 'MetricErrorTooltipCtx';
export const getMetricErrorTooltip = () => getContext(ID);</script>

<script>import Context from 'san-webkit/lib/ui/Tooltip/Context.svelte';
const settings = {
  dark: true,
  align: 'center',
  position: 'top',
  closeTimeout: 0,
  class: 'caption dark tooltip-6AdV5o'
};</script>

<Context id={ID} {settings}>
  <slot />

  <svelte:fragment slot="tooltip" let:props>
    {props.error}
  </svelte:fragment>
</Context>

<style>
  :global(.tooltip-6AdV5o) {
    max-width: 310px;
    z-index: 24;
  }
</style>
