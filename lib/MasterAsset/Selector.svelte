<script>
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { showMasterSelectorDialog } from './../MasterSelectorDialog'
  import { preloadSuggestions } from './../MasterSelectorDialog/Suggestions.svelte'
</script>

<div
  id="fw-master-selector"
  class="body-1 btn row v-center"
  on:click={() => showMasterSelectorDialog()}
  use:preloadSuggestions
>
  <slot />
  <Svg id="arrow-down" w="8" h="5" class="mrg-s mrg--l svg-L8tfyp" />
</div>

<style>
  div {
    --fill: var(--waterloo);
    --color-hover: var(--green);
    user-select: text;
  }

  :global(.svg-L8tfyp) {
    user-select: all;
  }
</style>
