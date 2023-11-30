import { parseIntervalString, ONE_MINUTE_IN_MS, ONE_HOUR_IN_MS, ONE_DAY_IN_MS, ONE_SECOND_IN_MS, } from 'san-webkit/lib/utils/dates';
const intervalIndices = [];
export const INTERVALS = [
    makeInterval('5m', '5 minutes'),
    makeInterval('15m', '15 minutes'),
    makeInterval('30m', '30 minutes'),
    makeInterval('1h', '1 hour'),
    makeInterval('2h', '2 hours'),
    makeInterval('3h', '3 hours'),
    makeInterval('4h', '4 hours'),
    makeInterval('6h', '6 hours'),
    makeInterval('8h', '8 hours'),
    makeInterval('12h', '12 hours'),
    makeInterval('1d', '1 day'),
    makeInterval('2d', '2 days'),
    makeInterval('3d', '3 days'),
    makeInterval('4d', '4 days'),
    makeInterval('5d', '5 days'),
    makeInterval('6d', '6 days'),
    makeInterval('7d', '7 days'),
];
function makeInterval(id, label) {
    intervalIndices.push(id);
    return { id, label };
}
export function getIntervals(minInterval) {
    const index = intervalIndices.indexOf(minInterval);
    return index === -1 ? INTERVALS : INTERVALS.slice(index);
}
export const isAvailableInterval = (interval, intervals) => intervals.some(({ id }) => id === interval);
export const getValidInterval = (interval, intervals) => (isAvailableInterval(interval, intervals) ? interval : intervals[0].id);
const FormatToTimestamp = {
    s: ONE_SECOND_IN_MS,
    m: ONE_MINUTE_IN_MS,
    h: ONE_HOUR_IN_MS,
    d: ONE_DAY_IN_MS,
};
export function getIntervalMilliseconds(interval) {
    const { amount, format } = parseIntervalString(interval || '1d');
    return amount * FormatToTimestamp[format];
}
export function normalizeInterval(interval, minInterval) {
    return getIntervalMilliseconds(interval) > getIntervalMilliseconds(minInterval)
        ? interval
        : minInterval;
}
//# sourceMappingURL=intervals.js.map