<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import EmbedDialog from './EmbedDialog.svelte'

  export const showEmbedDialog = (props): Promise<unknown> =>
    dialogs.show(EmbedDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { shareEmbeded, getChartWidgetLabel } from './utils'

  export let widgets

  let codeRef
  let copyTimer
  let copyLabel = 'Copy code'
  let width = '100%'
  let height = '300'
  let isNightMode = $globals.isNightMode
  let isWithMetricSettings = false
  let isCartesianGrid = true

  $: code = getCode(
    width,
    height,
    isNightMode,
    isWithMetricSettings,
    isCartesianGrid,
  )

  function getCode() {
    const settings = $studio
    const options = { isNightMode, isWithMetricSettings, isCartesianGrid }
    return widgets
      .map((widget, i) => {
        const qs = shareEmbeded(widget, settings, options)
        const label = getChartWidgetLabel(widget, settings)

        return `<!-- Chart #${i + 1}: ${label} -->
<iframe width="${width}" height="${height}" src="https://app.santiment.net/__embed?${qs}" title="Santiment Chart: ${label}"></iframe>`
      })
      .join('\n\n')
  }

  function onCopyClick() {
    codeRef.focus()
    codeRef.select()
    document.execCommand('copy')
    startCopyTimer()
  }

  function startCopyTimer() {
    window.clearTimeout(copyTimer)
    copyLabel = 'Copied!'
    copyTimer = setTimeout(() => (copyLabel = 'Copy code'), 1500)
  }
</script>

<Dialog {...$$props} title="Embed charts" class="$style.dialog">
  <div class="dialog-body">
    <div class="row mrg-l mrg--b">
      <div class="column">
        <div class="caption txt-m">Width</div>
        <input class="border" type="text" value={width} />
      </div>
      <div class="column mrg-l mrg--l">
        <div class="caption txt-m">Height</div>
        <input class="border" type="text" value={height} />
      </div>
    </div>

    <div
      class="row btn mrg-m mrg--b"
      on:click={() => (isNightMode = !isNightMode)}>
      Night mode <Toggle isActive={isNightMode} class="mrg-a mrg--l" />
    </div>

    <div
      class="row btn mrg-m mrg--b"
      on:click={() => (isCartesianGrid = !isCartesianGrid)}>
      Cartesian grid <Toggle isActive={isCartesianGrid} class="mrg-a mrg--l" />
    </div>

    <div
      class="row btn mrg-l mrg--b"
      on:click={() => (isWithMetricSettings = !isWithMetricSettings)}>
      Show metric's settings <Toggle
        isActive={isWithMetricSettings}
        class="mrg-a mrg--l" />
    </div>

    <div class="caption txt-m">Code</div>
    <textarea
      bind:this={codeRef}
      width="100%"
      rows="5"
      class="border row fluid"
      value={code}
      readonly />
    <div
      class="btn btn-1 btn--green row h-center mrg-m mrg--t"
      on:click={onCopyClick}>
      {copyLabel}
    </div>
  </div>
</Dialog>

<style>
  .dialog {
    /* width: 96%; */
    /* height: 92%; */
    /* padding: 16px; */
    position: relative;
  }

  .caption {
    color: var(--waterloo);
    margin: 0 0 4px;
  }

  input {
    width: 120px;
    padding: 5px 10px;
  }

  textarea {
    padding: 10px 12px;
  }
</style>
