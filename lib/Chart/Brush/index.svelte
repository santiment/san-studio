<script>import { initBrush, updateBrushState, updateBrushDimensions } from '@santiment-network/chart/brush';
import { getChart } from '../context';
import { clearCtx } from '../utils';
import { themes } from '../theme';
import { setViewedIndicis, getBrushPlotItems, BRUSH_HEIGHT } from './utils';
const chart = getChart();
export let data;
export let categories;
export let colors;
export let from, to;
export let onChange;
export let theme = themes[0];
const width = chart.canvasWidth;
const brush = initBrush(chart, width, BRUSH_HEIGHT, chart.theme.brush);
brush.canvas.classList.add('brush-HK_t36');
brush.plotBrushData = plotBrushData;
brush.redraw = redraw;
brush.updateWidth = updateWidth;
brush.onChangeEnd = onChange;
chart.brush = brush;
let shouldRedraw = 1;
$: shouldRedraw && (theme || data || categories || colors) && drawBrush();
$: if (setViewedIndicis(brush, data, from, to))
    shouldRedraw += 1;
$: chart.setPadding(Object.assign(chart.padding, {
    bottom: 70,
}));
function drawBrush() {
    brush.paintConfig = theme.brush;
    brush.bgColor = theme.bg;
    clearCtx(brush);
    redraw();
}
function plotBrushData() {
    getBrushPlotItems(chart.plotManager).forEach((plot) => {
        plot(brush, chart.scale, data, colors, categories);
    });
}
function updateWidth(width) {
    updateBrushDimensions(brush, width, BRUSH_HEIGHT);
    redraw();
}
function redraw() {
    if (data.length === 0)
        return;
    updateBrushState(brush, data, categories.joinedCategories);
}
</script>

<style>
  :global(.brush-HK_t36) {
    border: 1px solid var(--porcelain);
    border-radius: 4px;
  }
</style>
