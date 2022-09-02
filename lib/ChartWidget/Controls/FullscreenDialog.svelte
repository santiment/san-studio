<script context="module" lang="ts">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import FullscreenDialog from './FullscreenDialog.svelte';
export const showFullscreenChart = props => dialogs.show(FullscreenDialog, props);</script>

<script lang="ts">import { setContext, tick } from 'svelte';
import Dialog from 'san-webkit/lib/ui/Dialog';
import ChartWidget from './../../../lib/ChartWidget/index.svelte';
import { resetAbsoluteCoordinates } from './../../../lib/Chart/Drawer/coordinates';
export let widget;
export let fullscreenMetricsFilter = undefined;
let closeDialog;

if (widget.chart.drawer) {
  resetAbsoluteCoordinates(widget.chart.drawer);
}

setContext('fullscreen', () => closeDialog(false));

function onBeforeDialogClose() {
  const {
    drawer
  } = widget.chart;
  if (drawer) resetAbsoluteCoordinates(drawer);
}</script>

<Dialog
  {...$$props}
  {onBeforeDialogClose}
  noTitle
  animated={false}
  bind:closeDialog
  class="dialog-+wXMn6"
>
  {#await tick() then _}
    <ChartWidget {widget} isFullscreen isSingleWidget metricsFilter={fullscreenMetricsFilter} />
  {/await}
</Dialog>

<style>
  :global(.dialog-\+wXMn6) {
    width: 96%;
    height: 92%;
    padding: 16px;
    position: relative;
  }
</style>
