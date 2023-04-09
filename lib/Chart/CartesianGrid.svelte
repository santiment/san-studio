<svelte:options immutable />

<script>import { onDestroy } from 'svelte';
import { drawCartesianGrid } from '@santiment-network/chart/cartesianGrid';
import { getChart } from './context';
const chart = getChart();
const ID = 'cartesianGrid';
export let xTicks = undefined;
export let yTicks = undefined;
chart.plotManager.set(ID, chart => {
  const {
    xAxesTicks = xTicks,
    yAxesTicks = yTicks,
    theme
  } = chart;
  drawCartesianGrid(chart, theme.axes, xAxesTicks, yAxesTicks);
});
chart.redraw();
onDestroy(() => {
  chart.plotManager.delete(ID);
  chart.redraw();
});</script>
