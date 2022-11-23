// NOTE: Don't change ids! This will break parsing of shared links
export var MetricType;
(function (MetricType) {
    MetricType[MetricType["Basic"] = 0] = "Basic";
    MetricType[MetricType["ProjectLocked"] = 1] = "ProjectLocked";
    MetricType[MetricType["Indicator"] = 2] = "Indicator";
    MetricType[MetricType["MergedSupplyDistribution"] = 3] = "MergedSupplyDistribution";
    MetricType[MetricType["AddressLocked"] = 4] = "AddressLocked";
    // Combined = 4,
})(MetricType || (MetricType = {}));
export const newKey = (...data) => '[' + data.join(';') + ']';
export function each(nodes, clb) {
    const keys = Object.keys(nodes);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        clb(nodes[key], key, i);
    }
    return nodes;
}
export function deriveMetric(baseMetric, newMetric) {
    const { key, queryKey = key, domainGroup = key } = baseMetric;
    const { reqMeta } = newMetric;
    newMetric.domainGroup = domainGroup;
    newMetric.queryKey = queryKey;
    if (reqMeta) {
        newMetric.reqMeta = Object.assign({}, baseMetric.reqMeta, reqMeta);
    }
    return Object.assign({}, baseMetric, newMetric);
}
export function newProjectMetricKey(project, metric) {
    const { slug, ticker } = project;
    return newKey(MetricType.ProjectLocked, metric.key, slug, ticker);
}
const ProjectMetricCache = {};
export function newProjectMetric(project, baseMetric) {
    const { ticker, slug } = project;
    const key = newProjectMetricKey(project, baseMetric);
    const cached = ProjectMetricCache[key];
    if (cached)
        return cached;
    // TODO: Refactor [@vanguard | Jun  9, 2021]
    const isWatchlist = slug === 'stablecoins';
    const selector = isWatchlist ? 'watchlistSlug' : 'slug';
    const metric = deriveMetric(baseMetric, {
        key,
        project: { ticker, slug },
        base: baseMetric,
        label: `${baseMetric.label} (${ticker})`,
        reqMeta: {
            [selector]: slug,
        },
    });
    if (isWatchlist)
        metric.selector = selector;
    ProjectMetricCache[key] = metric;
    return metric;
}
const AddressMetricCache = {};
export function minifyAddress(address) {
    return address.slice(0, 4) + '...' + address.slice(-4);
}
export function newAddressMetric(address, baseMetric) {
    const key = newKey(MetricType.AddressLocked, baseMetric.key, address);
    const cached = AddressMetricCache[key];
    if (cached)
        return cached;
    const metric = deriveMetric(baseMetric, {
        key,
        base: baseMetric,
        label: `${baseMetric.label} (${minifyAddress(address)})`,
        reqMeta: {
            address,
        },
    });
    return metric;
}
//# sourceMappingURL=utils.js.map