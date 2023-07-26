import { addCandlesTooltipPrintable } from '@santiment-network/chart/candles';
import { ONE_DAY_IN_MS } from 'san-webkit/lib/utils/dates';
import { Node } from './../../Chart/nodes.js';
import { yAxisFormatter } from './../../Chart/Axes/utils.js';
import { getIntervals, getValidInterval } from './../../utils/intervals.js';
import { queryOHLC } from './../../api/timeseries/ohlc.js';
export function getCandlesPeriodMinInterval(from, to) {
    const diff = (+to - +from) / ONE_DAY_IN_MS;
    if (diff < 2)
        return '15m';
    if (diff < 8)
        return '30m';
    if (diff < 33)
        return '2h';
    if (diff < 185)
        return '12h';
    if (diff < 366)
        return '1d';
    return '7d';
}
export function cleanupCandlesSettings(metric, metricSettings, ChartMetricDisplays) {
    if (metricSettings.fetcher === queryOHLC) {
        delete metricSettings.fetcher;
        ChartMetricDisplays.delete(metric.key, 'metricPrintablePusher');
    }
}
const axisFormatter = (value) => value && yAxisFormatter(value.close || value);
export function setCandlesSettings(metric, metricSettings, { from, to }, ChartMetricDisplays) {
    metricSettings.fetcher = queryOHLC;
    metricSettings.interval = getValidInterval(metricSettings.interval, getIntervals(getCandlesPeriodMinInterval(new Date(from), new Date(to))));
    ChartMetricDisplays.set(metric.key, {
        axisFormatter,
        metricPrintablePusher: addCandlesTooltipPrintable,
    });
}
export function transformCandles(metric, metricSettings, studioSettings, ChartMetricDisplays) {
    if (metricSettings.node !== Node.CANDLES) {
        cleanupCandlesSettings(metric, metricSettings, ChartMetricDisplays);
        return metricSettings;
    }
    setCandlesSettings(metric, metricSettings, studioSettings, ChartMetricDisplays);
    return metricSettings;
}
//# sourceMappingURL=candles.js.map