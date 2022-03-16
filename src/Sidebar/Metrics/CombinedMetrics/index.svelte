<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { getWidgets } from '@/stores/widgets'
  import Category from '@/Sidebar/Category.svelte'
  import { showCombineDialog } from '@/CombineDialog/index.svelte'

  export let searchTerm = ''
  export let isFiltering = false

  let items = []

  function onAdd() {
    showCombineDialog({
      metrics: [],
    })
  }
</script>

{#if !isFiltering || (isFiltering && items.length)}
  <Category category="Combined metrics" isOpened {isFiltering} arrowClass="mrg-l">
    <svelte:fragment slot="pre-title">
      <Svg id="fx" w="16" h="15" class="mrg-s mrg--r $style.icon" />
    </svelte:fragment>

    <svelte:fragment slot="post-title">
      <button
        class="btn mrg-a mrg--l expl-tooltip row hv-center"
        aria-label="Add"
        on:click|stopPropagation={onAdd}>
        <Svg id="plus" w="10" />
      </button>
    </svelte:fragment>

    {#each items as _}
      Metrics
    {:else}
      <div class="mrg-s mrg--l">Create brand new metric composites</div>
    {/each}
  </Category>
{/if}

<style lang="scss">
  .icon {
    fill: var(--blue) !important;
  }

  .btn {
    --fill: var(--waterloo);
    --fill-hover: var(--green);

    &:hover + :global(svg) {
      fill: var(--waterloo);
    }
  }
</style>
