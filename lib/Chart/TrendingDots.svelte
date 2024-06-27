<svelte:options immutable />

<script>import { getContext } from 'svelte';
import { getChart } from './context';
const chart = getChart();
export let references = [];
const dataCtx = getContext('dataCtx');
$: references && chart.redraw();
chart.plotManager.set('trendingDots', (chart, _, data, colors) => {
    const { ctx, points } = chart;
    references.forEach((metric) => {
        var _a, _b;
        const key = metric.key;
        const target = metric.project
            ? metric.key.replace(metric.base.key, metric.references)
            : metric.references;
        const alpha = ((_a = colors[target]) === null || _a === void 0 ? void 0 : _a.length) < 8 ? '' : '22';
        for (let i = 0; i < data.length - 1; i++) {
            const item = data[i];
            const value = item[key];
            if (!value)
                continue;
            const point = points[i];
            const targetPoint = point[target];
            if (!targetPoint)
                continue;
            if ((_b = dataCtx.rawData[i]) === null || _b === void 0 ? void 0 : _b[key]) {
                ctx.beginPath();
                ctx.arc(point.x, targetPoint.y - 2, 4, 0, Math.PI * 2);
                ctx.fillStyle = metric.getColor(value) + alpha;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#9FAAC4' + alpha;
                ctx.stroke();
            }
            point[key] = {
                y: data.y,
                value,
            };
        }
    });
});
</script>
