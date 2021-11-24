<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { mapview, MapviewPhase } from '@/stores/mapview'
  import LayoutActions from '@/Layouts/index.svelte'
  import Layout from './Layout.svelte'

  export let headerPadding = 0

  let headerNode: HTMLDivElement

  $: isMapview = $mapview !== MapviewPhase.None
  $: headerNode && changeHeaderPosition(isMapview)

  function changeHeaderPosition(isMapview: boolean) {
    let transform
    if (isMapview) {
      let { top } = headerNode.getBoundingClientRect()

      if (window.scrollY < headerPadding) {
        top -= headerPadding - window.scrollY - 1
      }

      transform = `translateY(-${top}px)`
    } else {
      transform = null
    }
    headerNode.style.transform = transform
  }
</script>

<div class="border header panel row v-center" bind:this={headerNode}>
  <Layout />

  <LayoutActions />

  <div class="copy row v-center btn--green mrg-s mrg--l mrg--r">
    <button class="share action btn">Share</button>
    <button class="link action btn expl-tooltip" aria-label="Copy link"
      ><Svg id="link" w="16" /></button>
  </div>
  <div
    class="mapview btn border"
    on:click={mapview.toggle}
    class:active={$mapview !== MapviewPhase.None}>
    Mapview
  </div>
</div>

<style>
  .panel {
    padding: 14px 16px;
  }

  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 24;
    margin: 0 0 13px;
    transition: transform 0.3s ease-out;
    min-height: 64px;
  }

  .mapview {
    padding: 5px 20px;
    --color-hover: var(--green);
  }
  .active {
    --bg: var(--green-light-1);
    --color: var(--green);
    --border: var(--green);
    --color-hover: var(--green-hover);
    --border-hover: var(--green-hover);
  }

  .share {
    padding: 6px 14px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .link {
    padding: 6px 8px;
    border-left: 1px solid var(--white);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    --expl-align-x: -46%;
  }
</style>
