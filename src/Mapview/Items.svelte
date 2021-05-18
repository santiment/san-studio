<script lang="ts">
  import { selectedMetrics } from '@/stores/selector'
  import MetricButton from '@/MetricButton.svelte'

  let className = ''
  export { className as class }
  export let items
  export let name
</script>

{#if items.length}
  <div class="row v-center {className}">
    <span>
      You have selected {items.length}
      {name}(s):
    </span>
    <div class="metrics row">
      {#each items as metric (metric.key)}
        <MetricButton {metric} onDelete={selectedMetrics.toggle} />
      {/each}
    </div>
    <div class="clear btn mrg-a mrg--l" on:click={selectedMetrics.clear}>
      Clear selected
    </div>
  </div>
{/if}

<style>
  .row:only-child {
    margin: 0;
  }

  .metrics {
    margin: 0 0 -8px 8px;
  }

  span {
    color: #fff;
  }

  .clear {
    cursor: pointer;
    padding: 6px 12px;
    --bg: var(--white);
    --bg-hover: var(--white);
    --color: var(--red);
    --color-hover: var(--red-hover);
  }
</style>
