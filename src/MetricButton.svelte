<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'

  let className = ''
  export { className as class }
  export let metric: Studio.Metric
  export let ticker: string | undefined = undefined
  export let active = false
  export let highlight = false
  export let error: string | undefined = undefined
  export let colors = undefined
  export let isLoading = false
  export let onDelete = undefined
  export let node = undefined

  $: color = colors && getColor(metric, colors, highlight)
  $: label = (ticker && metric.getLabel?.(ticker)) || metric.label

  function getColor({ key }: Studio.Metric, colors, highlight = false) {
    const color = colors[key]
    let style = '--color:' + color

    if (highlight && color.length < 8) {
      style += `;--h-color:${color}11;---border:${color}55`
    }

    return style
  }
</script>

<div
  bind:this={node}
  class="metric row v-center {className}"
  class:active
  class:error
  class:highlight
  style={color}
  on:click
  on:mouseenter
  on:mouseleave>
  <div class="color" class:loader={isLoading} />

  {label}

  <slot />

  {#if onDelete}
    <div class="btn MetricButton__btn delete" on:click={() => onDelete(metric)}>
      <Svg id="cross" w="8" />
    </div>
  {/if}
</div>

<style>
  .metric {
    position: relative;
    min-height: 32px;
    padding: 0 10px 0 10px;
    border-radius: 4px;
    box-shadow: inset 0px 0px 0px 1px var(---border, var(--porcelain));
    user-select: none;
    cursor: pointer;
    margin: 0 0 8px 8px;
    background: var(--white);
  }

  .color {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: var(--color);
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    overflow: hidden;
  }

  .loader::before {
    content: '';
    position: absolute;
    background: var(--porcelain);
    width: 4px;
    height: 100%;
    animation: loader 800ms infinite;
  }

  .active,
  .metric:hover {
    ---border: var(--color) !important;
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

  .highlight {
    background: var(--h-color);
  }

  .delete {
    margin-right: -6px;
  }

  @keyframes loader {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
</style>
