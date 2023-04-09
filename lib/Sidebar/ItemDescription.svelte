<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { Description, prepareDescription } from './../metrics/description';
import { studio } from './../stores/studio';
let className = '';
export { className as class };
export let item;
let trigger;
let tooltip;

$: description = item && Description[item.key];</script>

{#if description}
  <Tooltip position="right" align="center" openDelay={110}>
    <div slot="trigger" bind:this={trigger}>
      <Svg id="info" class="{className} info-Xlib72" />
    </div>
    <div slot="tooltip" class="description" bind:this={tooltip}>
      <div class="title txt-m mrg-s mrg--b">
        {item.label}
      </div>
      {@html prepareDescription(description, $studio.ticker)}
    </div>
  </Tooltip>
{/if}

<style>
  :global(.info-Xlib72:hover) {
    fill: var(--black);
  }

  .description {
    width: 304px;
    z-index: 1000;
    padding: 18px 24px;
    color: var(--waterloo);
    white-space: pre-line;
  }

  .title {
    color: var(--black);
  }

  .description :global(a) {
    color: var(--green);
  }

  .description :global(a:hover) {
    color: var(--green-hover);
  }
</style>
