<svelte:options immutable />

<script>import { plotBars } from '@santiment-network/chart/bars';
import { getChart } from './context';
const chart = getChart();
chart.plotManager.set('bars', (chart, scale, data, colors, categories) => {
  plotBars(chart, data, categories.bars, scale, colors);
});</script>
