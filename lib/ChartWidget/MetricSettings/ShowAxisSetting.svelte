<script>import { track } from 'san-webkit/lib/analytics';
import { withScroll } from 'san-webkit/lib/ui/history';
import Checkbox from 'san-webkit/lib/ui/Checkbox.svelte';
import { Event } from './../../analytics';
import { getHistoryContext } from './../../history/ctx';
import { getWidget } from './../../ChartWidget/context';
import Setting from './Setting.svelte';
const History = getHistoryContext();
const widget = getWidget();
const {
  ChartAxes
} = widget;
export let metric;

$: isDisabled = $ChartAxes.size < 2 && $ChartAxes.has(metric);

function onClick() {
  if (isDisabled) return;
  track.event($ChartAxes.has(metric) ? Event.HideMetricAxis : Event.ShowMetricAxis, {
    metric: metric.key
  });

  const toggle = () => ChartAxes.toggle(metric);

  toggle();
  History.add('Toggle axis', withScroll(widget, toggle));
}</script>

<Setting on:click={onClick}>
  Show axis
  <Checkbox
    class="mrg-s mrg--l {isDisabled ? 'disabled-u7dnC6' : ''}"
    isActive={$ChartAxes.has(metric)}
  />
</Setting>

<style>
  :global(.disabled-u7dnC6) {
    background-color: var(--porcelain) !important;
    border-color: var(--porcelain) !important;
  }
</style>
