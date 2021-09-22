<script lang="ts">
  import { ADDONS } from './addons'

  export let addons = []
  export let isPro
  export let slug
</script>

{#each addons as addon (addon.key)}
  {#if ADDONS[addon.key]}
    {#await ADDONS[addon.key]() then Component}
      <svelte:component this={Component.default} {addon} {isPro} {slug} />
    {/await}
  {/if}
{/each}

<style>
</style>
