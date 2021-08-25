<script lang="ts">
  import { studio } from '@/stores/studio'
  import { shareEmbeded, getChartWidgetLabel } from './utils'

  export let widgets
  export let width, height
  export let isNightMode, isWithMetricSettings, isCartesianGrid

  let codeRef
  let copyTimer
  let copyLabel = 'Copy code'

  // prettier-ignore
  // @ts-ignore
  $: code = (widgets, width, height, isNightMode, isWithMetricSettings, isCartesianGrid, getCode())

  function getCode() {
    const settings = $studio
    const options = { isNightMode, isWithMetricSettings, isCartesianGrid }
    return widgets
      .map((widget) => {
        const qs = shareEmbeded(widget, settings, options)
        const label = getChartWidgetLabel(widget, settings)

        return `<iframe title="Santiment Chart: ${label}" width="${width}" height="${height}" src="${window.location.origin}/__chart?${qs}"></iframe>`
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
    copyTimer = setTimeout(() => (copyLabel = 'Copy code'), 1000)
  }
</script>

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

<style>
  textarea {
    padding: 10px 12px;
    color: var(--black);
  }
</style>
