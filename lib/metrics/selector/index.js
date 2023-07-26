import { Metric } from './../../metrics/index.js';
import { each } from './../../metrics/utils.js';
import { lookupReplacement } from './replacements.js';
// export const SelectorNode = {} as Selector
export const SelectorNode = {};
each(Metric, (metric, key) => {
    if (lookupReplacement(SelectorNode, key))
        return;
    SelectorNode[key] = metric;
});
//# sourceMappingURL=index.js.map