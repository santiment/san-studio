<script lang="ts">
  import { SelectorNode } from '@/metrics/selector'

  export let addons = []
  export let isPro
  export let slug

  const PATHS = {
    [SelectorNode.SPENT_COIN_COST.key]: () => import('./SpentCoinCost.svelte'),
  }
</script>

{#each addons as { key } (key)}
  {#if PATHS[key]}
    {#await PATHS[key]() then Component}
      <svelte:component this={Component.default} {isPro} {slug} />
    {/await}
  {/if}
{/each}

<style>
</style>
