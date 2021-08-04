<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import FullscreenDialog from './FullscreenDialog.svelte'

  export const showFullscreenChart = (props): Promise<unknown> =>
    dialogs.show(FullscreenDialog, props)
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import Dialog from 'webkit/ui/Dialog'
  import ChartWidget from '@/ChartWidget/index.svelte'

  export let widget
  export let fullscreenMetricsFilter = undefined
  let closeDialog

  setContext('fullscreen', () => closeDialog(false))

  function onBeforeDialogClose() {
    const { drawer } = widget.chart
    if (drawer) drawer.recalcAbsCoor()
  }
</script>

<Dialog
  {...$$props}
  {onBeforeDialogClose}
  noTitle
  bind:closeDialog
  class="$style.dialog">
  <ChartWidget
    {widget}
    isFullscreen
    isSingleWidget
    metricsFilter={fullscreenMetricsFilter} />
</Dialog>

<style>
  .dialog {
    width: 96%;
    height: 92%;
    padding: 16px;
    position: relative;
  }
</style>
