<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import FullscreenDialog from './FullscreenDialog.svelte'

  export const showFullscreenChart = (props): Promise<unknown> =>
    dialogs.show(FullscreenDialog, props)
</script>

<script lang="ts">
  import { setContext, tick } from 'svelte'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import ChartWidget from './../../ChartWidget/index.svelte'
  import { resetAbsoluteCoordinates } from './../../Chart/Drawer/coordinates'

  export let widget
  export let fullscreenMetricsFilter = undefined
  let closeDialog

  if (widget.chart.drawer) {
    resetAbsoluteCoordinates(widget.chart.drawer)
  }

  setContext('fullscreen', () => closeDialog(false))

  function onBeforeDialogClose() {
    const { drawer } = widget.chart
    if (drawer) resetAbsoluteCoordinates(drawer)
  }
</script>

<Dialog
  {...$$props}
  {onBeforeDialogClose}
  noTitle
  animated={false}
  bind:closeDialog
  class="$style.dialog"
>
  {#await tick() then _}
    <ChartWidget {widget} isFullscreen isSingleWidget metricsFilter={fullscreenMetricsFilter} />
  {/await}
</Dialog>

<style>
  .dialog {
    width: 96%;
    height: 92%;
    padding: 16px;
    position: relative;
  }
</style>
