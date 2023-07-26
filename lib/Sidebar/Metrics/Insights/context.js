import { writable } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { Event } from './../../../analytics.js';
const DEFAULT = {
    insight: undefined,
    from: undefined,
    to: undefined,
};
export function newInsightsContextStore() {
    const InsightContext = Object.assign({}, DEFAULT);
    const { subscribe, set } = writable(InsightContext);
    return {
        subscribe,
        set(newInsight, from, to) {
            InsightContext.insight = newInsight === InsightContext.insight ? undefined : newInsight;
            if (from && to) {
                InsightContext.from = from;
                InsightContext.to = to;
            }
            set(InsightContext);
            if (InsightContext.insight) {
                const isProject = newInsight.group === 'Tags';
                track.event(Event.Insights, {
                    type: isProject ? 'asset' : newInsight.key,
                    asset: isProject ? newInsight.key : undefined,
                });
            }
        },
        apply(value) {
            Object.assign(InsightContext, value);
            set(InsightContext);
        },
        changePeriod(from, to) {
            InsightContext.from = from;
            InsightContext.to = to;
            set(InsightContext);
        },
    };
}
//# sourceMappingURL=context.js.map