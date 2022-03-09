<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Svg from 'webkit/ui/Svg/svelte'

  export let metric: Studio.Metric
  export let colors
  export let isMerging = false
  export let isActive = false
  export let onClick

  $: color = colors[metric.key]
  $: style = color ? `---fill:${color}` : ''
</script>

<div
  {style}
  class="btn-ghost mrg-s mrg--b row v-center"
  class:active={isActive}
  on:click={(e) => onClick(metric, e)}>
  {#if isMerging}
    <Checkbox class="mrg-s mrg--r" {isActive} />
  {:else}
    <Svg id="circle-line" class="$style.line" w="14" h="10" />
  {/if}
  {metric.label}
  <slot />
</div>

<style>
  .btn-ghost {
    padding: 6px 12px;
    --fill: var(---fill, var(--casper));
    --fill-hover: var(---fill, var(--casper));
    --color: var(--casper);
    --color-hover: var(--black);
  }

  .active {
    --color: var(--black) !important;
  }

  .line {
    margin-right: 10px;
    min-width: 14px;
  }
</style>
