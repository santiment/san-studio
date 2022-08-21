import { millify } from 'san-webkit/lib/utils/formatting';
import { ONE_DAY_IN_MS, getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates';
const DAY_INTERVAL = ONE_DAY_IN_MS * 2;
export function clearCtx(chart, ctx = chart.ctx) {
    const { canvasWidth, canvasHeight } = chart;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
export function getDateDayMonthYear(date) {
    const { DD, MMM, YY } = getDateFormats(new Date(date));
    return `${DD} ${MMM} ${YY}`;
}
export function getDateHoursMinutes(date) {
    const { HH, mm } = getTimeFormats(new Date(date));
    return `${HH}:${mm}`;
}
export function yBubbleFormatter(value) {
    if (!value && value !== 0) {
        return '-';
    }
    if (value < 1) {
        return value.toFixed(4);
    }
    if (value < 100) {
        return millify(value, 3);
    }
    return millify(value);
}
export function getDefaultTooltipSettings() {
    return {
        datetime: {
            formatter: (value) => {
                const date = new Date(value);
                const { HH, mm } = getTimeFormats(date);
                const { MMMM, DD, YYYY } = getDateFormats(date);
                return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`;
            },
        },
        spentCoinCost: {
            formatter: (value) => value,
            label: 'Transacted Coin Acquisition Cost',
        },
    };
}
export function linearDatetimeScale(chart) {
    var _a, _b;
    const { width, data, left } = chart;
    const min = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.datetime) || 0;
    const max = ((_b = data[data.length - 1]) === null || _b === void 0 ? void 0 : _b.datetime) || 0;
    const xFactor = width / (max - min);
    return (value) => left + (value - min) * xFactor;
}
export function isDayInterval(chart) {
    var _a, _b;
    const { points } = chart;
    const lastIndex = points.length - 1;
    const firstDate = (_a = points[0]) === null || _a === void 0 ? void 0 : _a.value;
    const lastDate = (_b = points[lastIndex]) === null || _b === void 0 ? void 0 : _b.value;
    return lastDate - firstDate < DAY_INTERVAL;
}
export function findPointByDate(points, target) {
    const lastIndex = points.length - 1;
    const firstDate = points[0].value;
    const lastDate = points[lastIndex].value;
    const factor = lastIndex / (lastDate - firstDate);
    let index = Math.round((target - firstDate) * factor);
    let point = points[index];
    if (!point)
        return;
    const foundDatetime = point.value;
    if (foundDatetime === target) {
        return point;
    }
    // Adjusting found date to be closest to the target date
    if (foundDatetime < target) {
        index += 1;
        while (index < points.length) {
            point = points[index];
            if (point.value >= target) {
                return points[index - 1];
            }
            index += 1;
        }
    }
    else {
        index -= 1;
        while (index > -1) {
            point = points[index];
            if (point.value <= target) {
                return points[index + 1];
            }
            index -= 1;
        }
    }
}
export function mapClosestValue(data, MetricNodes) {
    const { joinedCategories: allNodes, candles } = MetricNodes;
    const dataLength = data.length;
    if (!dataLength || allNodes.length < 2)
        return data;
    const result = new Array(data);
    for (let i = 0; i < dataLength; i++) {
        result[i] = Object.assign({}, data[i]);
    }
    const candlesSet = new Set(candles);
    for (let i = 0, len = allNodes.length; i < len; i++) {
        const metricKey = allNodes[i];
        if (candlesSet.has(metricKey))
            continue;
        let leftValueIndex = 0;
        for (; leftValueIndex < dataLength; leftValueIndex++) {
            if (result[leftValueIndex][metricKey]) {
                break;
            }
        }
        if (leftValueIndex === dataLength)
            continue;
        let rightValueIndex = dataLength;
        while (result[--rightValueIndex][metricKey] === undefined) { }
        let lastPointsInterval = 0;
        let lastPointIndex = rightValueIndex;
        while (lastPointIndex && !result[--lastPointIndex][metricKey])
            lastPointsInterval += 1;
        let neighbourValue = result[leftValueIndex][metricKey];
        for (let y = leftValueIndex + 1; y < rightValueIndex; y++) {
            const item = result[y];
            const value = item[metricKey];
            if (value !== undefined) {
                neighbourValue = value;
            }
            else {
                item[metricKey] = neighbourValue;
            }
        }
        // Applying data for most-right values based on the interval between last points
        neighbourValue = result[rightValueIndex][metricKey];
        for (let y = rightValueIndex + 1; y < dataLength && lastPointsInterval > 0; y++) {
            result[y][metricKey] = neighbourValue;
            lastPointsInterval -= 1;
        }
    }
    return result;
}
//# sourceMappingURL=utils.js.map