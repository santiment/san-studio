import { prepareDomain } from '@santiment-network/chart/bars/greenRedBars';
import { Metric } from './../metrics/index.js';
import { Node } from './../Chart/nodes.js';
const DEFAULT_DOMAIN_METRIC = new Set([
    Metric.twitter_followers.key,
    // Metric.miners_balance.key,
]);
const NON_BAR_DOMAIN_METRIC = new Set([
    Metric.active_addresses_1h.key,
    Metric.active_addresses_24h.key,
    Metric.daily_active_addresses.key,
]);
function applyCustomDomain(defaultValue, value, isInverse = false) {
    if (value === undefined)
        return defaultValue;
    const percentageIndex = value.lastIndexOf('%');
    if (percentageIndex === -1)
        return +value;
    const percentValue = +value.slice(0, percentageIndex) / 100;
    return defaultValue * (isInverse ? 1 - percentValue : 1 + percentValue);
}
export function newDomainModifier(metrics, MetricSettings, widget) {
    const defaultMinMaxes = {};
    const MetricNode = {};
    metrics.forEach(({ key, node }) => {
        var _a;
        MetricNode[key] = ((_a = MetricSettings[key]) === null || _a === void 0 ? void 0 : _a.node) || node;
    });
    widget.defaultMinMaxes = defaultMinMaxes;
    return (metricKey, minMax) => {
        if (DEFAULT_DOMAIN_METRIC.has(metricKey))
            return;
        const node = MetricNode[metricKey];
        const metricSettings = MetricSettings[metricKey];
        let { min, max } = minMax;
        defaultMinMaxes[metricKey] = { min, max };
        if (node === Node.GREEN_RED_BAR) {
            return prepareDomain(minMax);
        }
        else if (node === Node.BAR && !NON_BAR_DOMAIN_METRIC.has(metricKey)) {
            max *= max > 0 ? 1.01 : 0.99;
            min = min < 0 ? min : 0;
        }
        else {
            max *= max > 0 ? 1.01 : 0.99;
            min *= min > 0 ? 0.99 : 1.01;
        }
        if (metricSettings) {
            const { axisMax, axisMin } = metricSettings;
            max = applyCustomDomain(max, axisMax);
            min = applyCustomDomain(min, axisMin, true);
        }
        minMax.max = max;
        minMax.min = min;
    };
}
const getMetricDomain = ({ domainGroup }) => domainGroup;
export function groupDomains(metrics, getDomain = getMetricDomain) {
    const Domain = {};
    const { length } = metrics;
    for (let i = 0; i < length; i++) {
        const metric = metrics[i];
        const { key } = metric;
        const domainGroup = getDomain(metric) || metric.domainGroup;
        if (!domainGroup)
            continue;
        if (Domain[domainGroup]) {
            Domain[domainGroup].push(key);
        }
        else {
            Domain[domainGroup] = metrics.includes(Metric[domainGroup]) ? [domainGroup, key] : [key];
        }
    }
    const domainGroups = Object.values(Domain);
    return domainGroups.length > 0 ? domainGroups : undefined;
}
export function getIndicatorDomainGroup(metric) {
    const { key, indicator, base, project, domainGroup } = metric;
    if (indicator)
        return indicator.domainGroup || base.key;
    return project ? key : domainGroup;
}
export function getIndicatorDomainGroups(metrics, getDomain = getIndicatorDomainGroup) {
    return groupDomains(metrics, getDomain);
}
export function checkHasDomainGroups(rawDomainGroups, alwaysDomainGroups = []) {
    if (!rawDomainGroups)
        return false;
    const RootDomainSet = {};
    for (let i = 0, len = rawDomainGroups.length; i < len; i++) {
        const group = rawDomainGroups[i];
        RootDomainSet[group[0]] = new Set(group.slice(1));
    }
    for (let i = 0, len = alwaysDomainGroups.length; i < len; i++) {
        const group = alwaysDomainGroups[i];
        const domainSet = RootDomainSet[group[0]];
        if (!domainSet)
            continue;
        for (let y = 1, len = group.length; y < len; y++) {
            domainSet.delete(group[y]);
        }
        if (domainSet.size > 0)
            return true;
    }
    const domains = Object.values(RootDomainSet);
    for (let i = 0, len = domains.length; i < len; i++) {
        if (domains[i].size)
            return true;
    }
    return false;
}
//# sourceMappingURL=domain.js.map