import { getIntervalMilliseconds, normalizeInterval } from './../utils/intervals.js';
import { dataAccessor } from './../api/timeseries/index.js';
import { queryMetric } from './../api/timeseries/queries/index.js';
import { getMetricMinInterval } from './../api/metrics/restrictions.js';
import { newKey } from './../metrics/utils.js';
import { parseMetricKey } from './../sharing/metrics.js';
let math = { evaluate: (_expression, _scope) => { } };
export function importMath() {
    return import('mathjs/lib/esm/number').then(({ create, all }) => (math = create(all)));
}
export function checkIsExpressionValid(metrics, expression) {
    try {
        const scope = {};
        for (let i = 1, len = metrics.length; i <= len; i++)
            scope['x' + i] = 1;
        math.evaluate(expression, scope);
        return true;
    }
    catch (e) {
        console.warn(e);
        return false;
    }
}
function newCombinedKey(expression) {
    return expression + '|' + Date.now();
}
export function updateCombineKey(metric) {
    const { key, baseMetrics } = metric;
    const [type, expression, _, name] = parseMetricKey(key);
    metric.key = newKey(type, expression, ...baseMetrics.map(({ key }) => key), name);
}
export function newExpessionMetric(baseMetrics, expression, label) {
    const normalizedExpression = expression.trim();
    const normalizedLabel = label.trim();
    const metric = {
        fetch,
        label: normalizedLabel,
        expression: normalizedExpression,
        baseMetrics,
        node: 'area',
        key: newCombinedKey(normalizedExpression),
    };
    return metric;
}
function getCommonMinInterval(intervals) {
    let minInterval = intervals[0];
    let minIntervalMiliseconds = getIntervalMilliseconds(minInterval);
    for (let i = 1, len = intervals.length; i < len; i++) {
        const interval = intervals[i];
        const intervalMiliseconds = getIntervalMilliseconds(interval);
        if (minIntervalMiliseconds < intervalMiliseconds) {
            minInterval = interval;
            minIntervalMiliseconds = intervalMiliseconds;
        }
    }
    return minInterval;
}
const COMBINED_KEY = 'COMBINED_KEY';
function fetch(variables, metric, cachePolicy) {
    const mathPromise = importMath();
    const { key, baseMetrics, expression } = metric;
    const minIntervalPromise = Promise.all(baseMetrics.flatMap((metric) => metric.baseMetrics || metric).map(getMetricMinInterval))
        .then(getCommonMinInterval)
        .then((minInterval) => (metric.minInterval = minInterval));
    const queries = baseMetrics.map(({ key, queryKey = key, reqMeta }) => minIntervalPromise
        .then((minInterval) => queryMetric(Object.assign(Object.assign({}, variables), { slug: (reqMeta === null || reqMeta === void 0 ? void 0 : reqMeta.slug) || variables.slug, metric: queryKey, key: COMBINED_KEY, interval: normalizeInterval(variables.interval || '', minInterval), label_fqn: reqMeta === null || reqMeta === void 0 ? void 0 : reqMeta.label_fqn }), undefined, cachePolicy))
        .then(dataAccessor));
    return mathPromise
        .then(() => Promise.all(queries))
        .then((allData) => {
        const { offsets, commonLength } = findBoundaries(allData);
        const result = new Array(commonLength);
        for (let i = 0; i < commonLength; i++) {
            const scope = {};
            for (let j = 0, jLen = allData.length; j < jLen; j++) {
                scope['x' + (j + 1)] = allData[j][offsets[j] + i][COMBINED_KEY];
            }
            const value = math.evaluate(expression, scope);
            result[i] = {
                datetime: allData[0][offsets[0] + i].datetime,
                [key]: Number.isFinite(value) ? value : i && result[i - 1][key],
            };
        }
        return result;
    });
}
function findBoundaries(allData) {
    const { length } = allData;
    let commonLength = Infinity;
    let minDatetime = 0;
    let maxDatetime = Infinity;
    for (let i = 0; i < length; i++) {
        const data = allData[i];
        const first = data[0];
        const last = data[data.length - 1];
        if (minDatetime < first.datetime)
            minDatetime = first.datetime;
        if (maxDatetime > last.datetime)
            maxDatetime = last.datetime;
    }
    const offsets = [];
    for (let i = 0; i < length; i++) {
        const data = allData[i];
        const { length } = data;
        let leftOffset = 0;
        let rightOffset = length - 1;
        for (; data[leftOffset].datetime < minDatetime; leftOffset++) { }
        for (; data[rightOffset].datetime > maxDatetime; rightOffset--) { }
        const diff = rightOffset - leftOffset;
        if (commonLength > diff)
            commonLength = diff;
        offsets[i] = leftOffset;
    }
    return { offsets, commonLength: commonLength + 1 };
}
//# sourceMappingURL=utils.js.map