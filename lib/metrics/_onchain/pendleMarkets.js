import { Node } from './../../Chart/nodes.js';
import { each } from '../utils.js';
export const PendleMarketsMetric = each({
    pendle_total_markets_tvl: {
        label: 'Pendle Total Markets TVL',
        node: Node.LINE,
    },
    pendle_underlying_apy: {
        label: 'Pendle Underlying APY',
        node: Node.LINE,
    },
    pendle_implied_apy: {
        label: 'Pendle Implied APY',
        node: Node.LINE,
    },
    pendle_yield_spread: {
        label: 'Pendle Yield Spread',
        node: Node.LINE,
    },
}, (metric) => {
    metric.group = 'Pendle Markets';
});
//# sourceMappingURL=pendleMarkets.js.map