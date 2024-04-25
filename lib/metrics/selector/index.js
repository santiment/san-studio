import { Metric } from './../../metrics/index.js';
import { each } from './../../metrics/utils.js';
import { lookupReplacement } from './replacements.js';
import { SelectorType } from './types.js';
// export const SelectorNode = {} as Selector
export const SelectorNode = {
    btc_halving: {
        key: 'btc_halving',
        label: 'Bitcoin Halving',
        selectorType: SelectorType.ChartAddon,
        type: 'addon',
        noProject: true,
    },
};
each(Metric, (metric, key) => {
    if (lookupReplacement(SelectorNode, key))
        return;
    SelectorNode[key] = metric;
});
//# sourceMappingURL=index.js.map