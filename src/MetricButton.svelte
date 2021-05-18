<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'

  let className = ''
  export { className as class }
  export let metric: Studio.Metric
  export let ticker: string | undefined = undefined
  export let active = false
  export let error: string | undefined = undefined
  export let colors = undefined
  export let onDelete = undefined

  $: color = colors && `--color: ${colors[metric.key]}`
  $: label = (ticker && metric.getLabel?.(ticker)) || metric.label
</script>

<div
  class="metric row v-center {className}"
  class:active
  class:error
  style={color}
  on:click
  on:mouseenter
  on:mouseleave>
  {label}

  <slot />

  {#if onDelete}
    <div class="btn MetricButton__btn" on:click={() => onDelete(metric)}>
      <Icon id="cross" w="8" />
    </div>
  {/if}
</div>

<style>
  .metric {
    position: relative;
    height: 32px;
    padding: 0 4px 0 10px;
    border-radius: 4px;
    box-shadow: inset 0px 0px 0px 1px var(---border, var(--porcelain));
    user-select: none;
    cursor: pointer;
    margin: 0 0 8px 8px;
    background: var(--white);
  }

  .metric::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: var(--color);
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .active,
  .metric:hover {
    ---border: var(--green);
  }

  :global(.MetricButton__btn) {
    width: 24px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 !important;
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  .error {
    ---border: var(--red) !important;
  }
</style>
