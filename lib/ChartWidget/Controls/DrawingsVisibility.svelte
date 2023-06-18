<script>import { track } from 'san-webkit/lib/analytics';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { Event } from './../../analytics';
import { recordDrawingVisibility } from './../../history/drawings';
import { getHistoryContext } from './../../history/ctx';
const History = getHistoryContext();
export let widget;
export let ChartDrawer;

$: isActive = $ChartDrawer.isHidden;

function onClick() {
  const newValue = !isActive;
  ChartDrawer.toggleVisibility(newValue);
  recordDrawingVisibility(History, widget, newValue);
  track.event(Event.DrawingsVisibility, {
    value: isActive
  });
}</script>

<div
  class="btn-3 expl-tooltip"
  aria-label={isActive ? 'Show drawings' : 'Hide drawings'}
  class:active={isActive}
  on:click={onClick}
>
  {#if isActive}
    <Svg id="eye-crossed" w="20" h="17" />
  {:else}
    <Svg id="eye" w="18" h="12" />
  {/if}
</div>
