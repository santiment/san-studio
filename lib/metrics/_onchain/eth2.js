import { mvrvPrecacher } from './../../api/timeseries/queries/mvrv';
import { mvrvFormatter, ratioPercentAxisFormatter } from '../formatters';
import { each } from '../utils';
export const Eth2Metric = each({
    eth2_stakers_realized_value_usd_365d: {
        label: 'ETH 2.0 Stakers Realized Value (365d)',
    },
    eth2_stakers_mvrv_usd_365d: {
        label: 'ETH 2.0 Stakers MVRV (365d)',
        node: 'filledLine',
        formatter: mvrvFormatter,
        axisFormatter: ratioPercentAxisFormatter,
        precacher: mvrvPrecacher,
    },
}, (metric) => {
    metric.group = 'ETH 2.0';
});
//# sourceMappingURL=eth2.js.map