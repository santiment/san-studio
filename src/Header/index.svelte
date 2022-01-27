<script lang="ts">
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
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

  function onShareClick() {
    track.event(Event.Share)
    window.onHeaderShareClick?.()
  }

  function onCopyLinkClick() {
    track.event(Event.CopyLink)
    window.onHeaderCopyLinkClick?.()
  }
</script>

<div class="border header panel row v-center" bind:this={headerNode}>
  <Layout />

  <LayoutActions />

  <div class="copy row v-center btn--green mrg-s mrg--l mrg--r">
    <button class="share action btn" on:click={onShareClick}>Share</button>
    <button
      class="link action btn expl-tooltip"
      aria-label="Copy link"
      on:click={onCopyLinkClick}><Svg id="link" w="16" /></button>
  </div>

  <div class="studio-calendar" />

  <div
    class="mapview btn-2"
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
    white-space: nowrap;
  }

  .active {
    --bg: var(--green-light-1);
    --color: var(--green);
    --border: var(--green);
    --color-hover: var(--green-hover);
    --border-hover: var(--green-hover);
  }

  .action {
    height: 32px;
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
