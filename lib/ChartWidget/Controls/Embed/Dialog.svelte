<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import EmbedDialog from './Dialog.svelte'

  export const showEmbedDialog = (props): Promise<unknown> => dialogs.show(EmbedDialog, props)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { globals } from './../../../stores/globals'
  import Code from './Code.svelte'
  import SelectChart from './SelectChart.svelte'
  import Setting, { PRO_PLUS } from './Setting.svelte'
  import EmbedSetting from './EmbedSetting.svelte'
  import EmbedPreview from './EmbedPreview.svelte'
  import CopyAccessLink from './CopyAccessLink.svelte'

  export let widgets
  const { ChartOptions } = widgets[0] || ({} as any)

  let width = '100%'
  let height = '300'
  let isNightMode = $globals.isNightMode
  let isWithMetricSettings = false
  let isCartesianGrid = true
  let isWatermarkHidden = ChartOptions ? !$ChartOptions.watermark : false
  let dataToken = ''
  let code = ''

  $: ({ isPro, isProPlus } = $globals)
  $: iframe = getIframeSource(code)

  function getIframeSource(code) {
    const html = code.split('\n')[0] as string
    const index = html.indexOf('src=') + 5
    return html.slice(index, html.indexOf('"', index))
  }
</script>

<Dialog {...$$props} title="Embed charts">
  <div class="dialog-body row">
    <div class="column">
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

      <EmbedSetting bind:dataToken {isPro} />

      <Setting bind:isActive={isNightMode} disabled={!isPro}>Night mode</Setting>

      <Setting bind:isActive={isCartesianGrid} disabled={!isPro}>Cartesian grid</Setting>

      <Setting bind:isActive={isWithMetricSettings} disabled={!isPro}
        >Show metric's settings</Setting
      >

      <Setting bind:isActive={isWatermarkHidden} disabled={!isProPlus} access={PRO_PLUS}
        >Hide watermark</Setting
      >

      <div class="caption txt-m">Code</div>
      <Code
        bind:code
        {widgets}
        {width}
        {height}
        {dataToken}
        {isNightMode}
        {isWithMetricSettings}
        {isCartesianGrid}
        {isWatermarkHidden}
      />

      <CopyAccessLink widget={Array.isArray(widgets) ? widgets[0] : widgets} />
    </div>

    <EmbedPreview src={iframe} />
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
