<script>import { plotCandles } from '@santiment-network/chart/candles';
import { getChart } from './context';
const chart = getChart();
chart.plotManager.set('candles', (chart, scale, data, colors, categories) => {
    plotCandles(chart, data, categories.candles, scale, colors);
});
</script>
