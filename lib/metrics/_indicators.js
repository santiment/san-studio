import { MetricCategory } from './graph.js';
import { ratioPercentForamtter, ratioPercentAxisFormatter } from './formatters.js';
import { each } from './utils.js';
import { Node } from './../Chart/nodes.js';
export const IndicatorsMetric = each({
    price_daa_divergence: {
        category: 'Indicators',
        label: 'Price DAA Divergence',
        node: Node.GREEN_RED_BAR,
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    adjusted_price_daa_divergence: {
        category: 'Indicators',
        label: 'Adjusted Price DAA Divergence',
        node: Node.GREEN_RED_BAR,
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
}, (metric) => {
    metric.category = MetricCategory.Indicators;
});
//# sourceMappingURL=_indicators.js.map