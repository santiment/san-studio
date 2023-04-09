<script>import { track } from 'san-webkit/lib/analytics';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { Event } from './../analytics';
import { mapview, MapviewPhase } from './../stores/mapview';
import LayoutActions from './../Layouts/index.svelte';
import Layout from './Layout.svelte';
export let headerPadding = 0;
let headerNode;

$: isMapview = $mapview !== MapviewPhase.None;

$: headerNode && changeHeaderPosition(isMapview);

function changeHeaderPosition(isMapview) {
  let transform;

  if (isMapview) {
    let {
      top
    } = headerNode.getBoundingClientRect();

    if (window.scrollY < headerPadding) {
      top -= headerPadding - window.scrollY - 1;
    }

    transform = `translateY(-${top}px)`;
  } else {
    transform = null;
  }

  headerNode.style.transform = transform;
}

function onShareClick() {
  var _a;

  track.event(Event.Share);
  (_a = window.onHeaderShareClick) === null || _a === void 0 ? void 0 : _a.call(window);
}

function onCopyLinkClick() {
  var _a;

  track.event(Event.CopyLink);
  (_a = window.onHeaderCopyLinkClick) === null || _a === void 0 ? void 0 : _a.call(window);
}</script>

<div class="border header panel row v-center" bind:this={headerNode}>
  <Layout />

  <LayoutActions />

  <div class="copy row v-center btn--green mrg-s mrg--l mrg--r">
    <button class="share action btn" on:click={onShareClick}>Share</button>
    <button class="link action btn expl-tooltip" aria-label="Copy link" on:click={onCopyLinkClick}
      ><Svg id="link" w="16" /></button
    >
  </div>

  <div class="studio-calendar" />

  <div
    class="mapview btn-2"
    on:click={mapview.toggle}
    class:active={$mapview !== MapviewPhase.None}
  >
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
