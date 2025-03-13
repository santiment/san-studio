<script>import { drawXAxisTicks, drawAxisLine, drawYAxisTicks } from '@santiment-network/chart/axes';
import { drawValueBubbleY } from '@santiment-network/chart/tooltip';
import { Y_MARGIN, MULTI_AXIS_WIDTH, getPadding, getBubbleTheme, getDomainObject, getMetricAxisFormatter, } from './utils';
import { getChart } from '../context';
import { isDayInterval, getDateHoursMinutes, getDateDayMonthYear } from '../utils';
const chart = getChart();
export let xTicks = 10;
export let yTicks = 8;
export let metricSettings;
export let axesMetricKeys;
const rightAxisMargin = chart.rightAxisMargin || Y_MARGIN;
$: chart.rightAxisMargin = axesMetricKeys.length ? rightAxisMargin : 0;
$: {
    chart.xAxesTicks = xTicks;
    chart.yAxesTicks = yTicks;
    chart.axesMetricKeys = axesMetricKeys;
}
$: chart.setPadding(getPadding(chart, axesMetricKeys));
chart.plotManager.set('axes', (chart, scale) => {
    const { ctx, theme, left, bottom, right, rightAxisMargin } = chart;
    ctx.fillStyle = theme.ticks.color;
    ctx.font = theme.ticks.font;
    drawAxisLine(ctx, theme.axes, left, bottom, right + rightAxisMargin, bottom);
    plotAxes(chart);
    const formatter = isDayInterval(chart) ? getDateHoursMinutes : getDateDayMonthYear;
    drawXAxisTicks(chart, formatter, scale, xTicks);
});
function plotAxes(chart) {
    const { ctx, colors, scale, domainGroups } = chart;
    const { right, rightAxisMargin } = chart;
    const domain = domainGroups ? getDomainObject(domainGroups) : {};
    const LastMetricPoint = getLastMetricPoint(chart, domain);
    ctx.textAlign = 'left';
    let lastValueOffset = rightAxisMargin;
    let offset = right + rightAxisMargin;
    const getFormatter = (key) => getMetricAxisFormatter(metricSettings, key);
    axesMetricKeys.forEach((key) => {
        const color = colors[key];
        const point = LastMetricPoint[key];
        if (!point)
            return;
        const formatter = getFormatter(key);
        drawYAxisTicks(chart, key, formatter, scale, offset + 6, yTicks);
        const sharedAxes = domain[key];
        if (sharedAxes) {
            let domainOffset = 2;
            sharedAxes.forEach((metricKey) => {
                const point = LastMetricPoint[metricKey];
                if (!point)
                    return;
                const _offset = offset + domainOffset;
                const color = colors[metricKey];
                const formatter = getFormatter(metricKey);
                plotAxis(chart, point, color, formatter, _offset, lastValueOffset);
                domainOffset += 2;
            });
        }
        plotAxis(chart, point, color, formatter, offset, lastValueOffset, true);
        offset += MULTI_AXIS_WIDTH;
        lastValueOffset += MULTI_AXIS_WIDTH;
    });
}
function plotAxis(chart, point, color, formatter, offset, valueOffset, isWithLine = false) {
    if (!color)
        return;
    const { ctx, theme, top, bottom } = chart;
    if (isWithLine)
        drawAxisLine(ctx, color, offset, top, offset, bottom);
    const { y } = point;
    const value = formatter(point.value);
    const bubbleTheme = getBubbleTheme(theme.bubbles, color);
    drawValueBubbleY(chart, ctx, value, y, bubbleTheme, valueOffset);
}
function getLastMetricPoint(chart, domain) {
    const { points } = chart;
    const LastMetricPoint = {};
    let unfoundMetricKeys = axesMetricKeys.slice();
    for (let i = axesMetricKeys.length - 1; i >= 0; i--) {
        const sharedAxes = domain[axesMetricKeys[i]];
        if (sharedAxes)
            unfoundMetricKeys = unfoundMetricKeys.concat(sharedAxes);
    }
    for (let i = points.length - 1; i >= 0 && unfoundMetricKeys.length; i--) {
        const point = points[i];
        for (let j = unfoundMetricKeys.length - 1; j >= 0; j--) {
            const metricKey = unfoundMetricKeys[j];
            const metricPoint = point[metricKey];
            if (metricPoint && metricPoint.value) {
                LastMetricPoint[metricKey] = metricPoint;
                unfoundMetricKeys.splice(j, 1);
            }
        }
    }
    return LastMetricPoint;
}
</script>
