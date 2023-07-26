import { MetricCategory } from './graph.js';
import { each } from './utils.js';
export const DevelopmentMetric = each({
    dev_activity: {
        label: 'Development Activity',
    },
    dev_activity_contributors_count: {
        node: 'bar',
        label: 'Dev. Activity Contributors Count',
    },
}, (metric) => {
    metric.category = MetricCategory.Development;
});
//# sourceMappingURL=_development.js.map