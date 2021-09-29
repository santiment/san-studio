<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'

  export let ChartDrawer

  $: isActive = $ChartDrawer.isHidden
</script>

<div
  class="btn expl-tooltip controls-btn controls-expl"
  title={isActive ? 'Show drawings' : 'Hide drawings'}
  class:controls-btn_active={isActive}
  on:click={ChartDrawer.toggleVisibility}>
  {#if isActive}
    <Svg id="eye-crossed" w="20" h="17" />
  {:else}
    <Svg id="eye" w="18" h="12" />
  {/if}
</div>
