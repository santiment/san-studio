<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { Description, prepareDescription } from '@/metrics/description'
  import { studio } from '@/stores/studio'

  let className = ''
  export { className as class }
  export let item

  let trigger
  let tooltip
  $: description = item && Description[item.key]
  $: item && cleanOldTrigger()

  function cleanOldTrigger() {
    if (tooltip && !description) {
      tooltip.parentNode.remove()
      if (trigger) trigger.remove()
    }
  }
</script>

{#if description}
  <Tooltip duration={0} position="right" align="center">
    <div slot="trigger" bind:this={trigger}>
      <Icon id="info" class="{className} $style.info" />
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
  .info:hover {
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
