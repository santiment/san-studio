<script>import { plotGreenRedBars } from '@santiment-network/chart/bars/greenRedBars';
import { getChart } from './context';
const chart = getChart();
chart.plotManager.set('greenRedBars', (chart, scale, data, colors, categories) => {
    categories.greenRedBars.forEach((metricKey) => {
        plotGreenRedBars(chart, data, metricKey, scale, colors);
    });
});
</script>
