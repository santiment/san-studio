import { Metric } from './../../metrics';
import { each } from './../../metrics/utils';
import { lookupReplacement } from './replacements';
// export const SelectorNode = {} as Selector
export const SelectorNode = {};
each(Metric, (metric, key) => {
    if (lookupReplacement(SelectorNode, key))
        return;
    SelectorNode[key] = metric;
});
//# sourceMappingURL=index.js.map