<script>import { studio } from './../../../stores/studio';
import { getAutoUpdater } from './../../../stores/autoUpdater';
import { shareEmbeded, getChartWidgetLabel } from './utils';
const AutoUpdater = getAutoUpdater();
export let widgets;
export let width, height;
export let isNightMode, isWithMetricSettings, isCartesianGrid, isWatermarkHidden;
export let code = '';
export let dataToken = '';
let codeRef;
let copyTimer;
let copyLabel = 'Copy code';
// prettier-ignore
// @ts-ignore
$: code = (widgets, width, height, dataToken, isNightMode, isWithMetricSettings, isCartesianGrid, isWatermarkHidden, getCode());
function getCode() {
    const settings = $studio;
    const options = {
        dataToken,
        isNightMode,
        isWithMetricSettings,
        isCartesianGrid,
        isWatermarkHidden,
        isAutoUpdated: $AutoUpdater.isUpdating,
    };
    return widgets
        .map((widget) => {
        const qs = shareEmbeded(widget, settings, options);
        const label = getChartWidgetLabel(widget, settings);
        return `<iframe title="Santiment Chart: ${label}" width="${width}" height="${height}" src="https://embed.santiment.net/chart?${qs}" scrolling="no"></iframe>`;
    })
        .join('\n\n');
}
function onCopyClick() {
    codeRef.focus();
    codeRef.select();
    document.execCommand('copy');
    startCopyTimer();
}
function startCopyTimer() {
    window.clearTimeout(copyTimer);
    copyLabel = 'Copied!';
    copyTimer = setTimeout(() => (copyLabel = 'Copy code'), 1000);
}
</script>

<textarea
  bind:this={codeRef}
  width="100%"
  rows="5"
  class="border row fluid"
  value={code}
  readonly
/>
<div class="btn-1 row h-center mrg-m mrg--t" on:click={onCopyClick}>
  {copyLabel}
</div>

<style>
  textarea {
    padding: 10px 12px;
    color: var(--black);
    resize: none;
  }
</style>
