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
  PinnedChartAxes
} = widget;
export let metric;

function onClick() {
  track.event($PinnedChartAxes.has(metric) ? Event.UnpinMetricAxis : Event.PinMetricAxis, {
    metric: metric.key
  });

  const toggle = () => PinnedChartAxes.toggle(metric);

  toggle();
  History.add('Pin axis', withScroll(widget, toggle));
}</script>

<Setting on:click={onClick}>
  Pin axis
  <Checkbox class="mrg-s mrg--l" isActive={$PinnedChartAxes.has(metric)} />
</Setting>
