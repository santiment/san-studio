import { capitalize } from 'san-webkit/lib/utils/formatting';
import { Metric } from '../index.js';
import { SelectorNode } from '../selector/index.js';
import { Node } from './../../Chart/nodes.js';
import { MetricCategory } from '../graph.js';
export const LABEL_ASSET_SLUG = `LABEL_ASSET_SLUG`;
export function humanifyLabelMetricName(displayName) {
    return displayName.split('_').map(capitalize).join(' ');
}
export const getAssetFreeLabelKey = (slug, labelFqn) => labelFqn.replace(`(${slug})`, '');
export const getDynamicAssetLabelKey = (slug, labelFqn) => labelFqn.replace(`(${slug})`, `(${LABEL_ASSET_SLUG})`);
export function createDynamicLabelFqnMetric(slug, labelFqn, displayName) {
    const key = getDynamicAssetLabelKey(slug, labelFqn);
    if (Metric[key]) {
        return Metric[key];
    }
    // NOTE: Requested by Alex G.
    if (labelFqn.includes('whale_usd_balance(')) {
        return null;
    }
    let label = displayName || labelFqn.replace(/(:v\d+)/g, '').replace(/(santiment\/)/g, '');
    // NOTE: Requested by Alex G.
    if (labelFqn.includes('whale_usd_balance_not_exchange(')) {
        label = 'Supply Held By Whales (exchanges excluded)';
    }
    else {
        const [main, mod] = label.split('->');
        label = humanifyLabelMetricName(getAssetFreeLabelKey(slug, main));
        if (mod)
            label += ` (${humanifyLabelMetricName(mod)})`;
        label = `Label Balance: ${label}`;
    }
    const metric = {
        key,
        queryKey: 'labelled_historical_balance',
        label,
        node: Node.LINE,
        category: MetricCategory.OnChainLabels,
        reqMeta: {
            label_fqn: (vars) => ((vars === null || vars === void 0 ? void 0 : vars.slug) ? key.replace(LABEL_ASSET_SLUG, `${vars.slug}`) : ''),
        },
    };
    Metric[metric.key] = metric;
    SelectorNode[metric.key] = metric;
    return metric;
}
//# sourceMappingURL=labelFqn.js.map