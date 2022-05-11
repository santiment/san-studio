<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { showMasterSelectorDialog } from '@/MasterSelectorDialog'
  import { preloadSuggestions } from '@/MasterSelectorDialog/Suggestions.svelte'
</script>

<div
  class="body-1 btn row v-center"
  on:click={() => showMasterSelectorDialog()}
  use:preloadSuggestions
>
  <slot />
  <Svg id="arrow-down" w="8" h="5" class="mrg-s mrg--l $style.svg" />
</div>

<style>
  div {
    --fill: var(--waterloo);
    --color-hover: var(--green);
    user-select: text;
  }

  .svg {
    user-select: all;
  }
</style>
