<script lang="ts">
  import { SelectorNode } from '@/metrics/selector'

  export let addons = []
  export let isPro
  export let slug

  const PATHS = {
    [SelectorNode.SPENT_COIN_COST.key]: () => import('./SpentCoinCost.svelte'),
  }
</script>

{#each addons as addon (addon.key)}
  {#if PATHS[addon.key]}
    {#await PATHS[addon.key]() then Component}
      <svelte:component this={Component.default} {addon} {isPro} {slug} />
    {/await}
  {/if}
{/each}

<style>
</style>
