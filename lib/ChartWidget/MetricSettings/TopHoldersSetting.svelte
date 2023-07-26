<script>import { withScroll } from 'san-webkit/lib/ui/history';
import { getHistoryContext } from './../../history/ctx';
import { getWidget } from './../../ChartWidget/context';
import Setting from './Setting.svelte';
const History = getHistoryContext();
const widget = getWidget();
const { MetricSettings } = widget;
export let metric;
$: metricSettings = MetricSettings.getMetricSettings(metric.key);
$: count = +((metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.holdersCount) || 10);
let timer;
function onChange({ target: { value } }) {
    count = +value;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        const oldCount = metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.holdersCount;
        const newCount = count || undefined;
        const redo = () => setHoldersCount(metric, newCount);
        redo();
        History.add('Smoothing change', withScroll(widget, () => setHoldersCount(metric, oldCount)), withScroll(widget, redo));
    }, 200);
}
function setHoldersCount({ key }, holdersCount) {
    if (!holdersCount)
        return MetricSettings.delete(key, 'holdersCount');
    MetricSettings.set(key, { holdersCount });
}
function onClick({ currentTarget }) {
    currentTarget.firstElementChild.focus();
}
</script>

<!-- svelte-ignore a11y-autofocus -->
<Setting on:click={onClick}>
  Top Holders:

  <input
    class="mrg-xs mrg--l"
    type="number"
    min="1"
    max="1000000"
    value={count}
    on:blur={() => !count && (count = 10)}
    on:input={onChange}
  />
</Setting>

<style>
  input {
    width: 4ch;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input {
    -moz-appearance: textfield;
  }
</style>
