<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import EmbedDialog from './Dialog.svelte'

  export const showEmbedDialog = (props): Promise<unknown> => dialogs.show(EmbedDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import { globals } from '@/stores/globals'
  import Code from './Code.svelte'
  import SelectChart from './SelectChart.svelte'
  import Setting, { PRO_PLUS } from './Setting.svelte'

  export let widgets
  const { ChartOptions } = widgets[0] || ({} as any)

  let width = '100%'
  let height = '300'
  let isNightMode = $globals.isNightMode
  let isWithMetricSettings = false
  let isCartesianGrid = true
  let isWatermarkHidden = ChartOptions ? !$ChartOptions.watermark : false

  $: ({ isPro, isProPlus } = $globals)
</script>

<Dialog {...$$props} title="Embed charts">
  <div class="dialog-body">
    <SelectChart bind:charts={widgets} />

    <div class="row mrg-l mrg--b">
      <div class="column">
        <div class="caption txt-m">Width</div>
        <input class="border body-3" type="text" bind:value={width} />
      </div>
      <div class="column mrg-l mrg--l">
        <div class="caption txt-m">Height</div>
        <input class="border body-3" type="text" bind:value={height} />
      </div>
    </div>

    <!-- <Setting>Share data access</Setting> -->

    <Setting bind:isActive={isNightMode} disabled={!isPro}>Night mode</Setting>

    <Setting bind:isActive={isCartesianGrid} disabled={!isPro}>Cartesian grid</Setting>

    <Setting bind:isActive={isWithMetricSettings} disabled={!isPro}>Show metric's settings</Setting>

    <Setting bind:isActive={isWatermarkHidden} disabled={!isProPlus} access={PRO_PLUS}
      >Hide watermark</Setting>

    <div class="caption txt-m">Code</div>
    <Code
      {widgets}
      {width}
      {height}
      {isNightMode}
      {isWithMetricSettings}
      {isCartesianGrid}
      {isWatermarkHidden} />
  </div>
</Dialog>

<style>
  .caption {
    color: var(--waterloo);
    margin: 4px 0;
  }

  input {
    width: 120px;
    padding: 5px 10px;
    color: var(--black);
  }
</style>
