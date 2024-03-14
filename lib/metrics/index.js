import { FinancialMetric } from './_financial.js';
import { SocialMetric } from './_social.js';
import { DevelopmentMetric } from './_development.js';
import { DerivativesMetric } from './_derivatives.js';
import { OnChainMetric } from './_onchain/index.js';
import { OnChainLabelsMetrics } from './_onchain_labels/index.js';
import { IndicatorsMetric } from './_indicators.js';
import { newTimebounds } from './timebounds.js';
import { each } from './utils.js';
import { Node } from './../Chart/nodes.js';
// NOTE: https://github.com/santiment/sanbase2/blob/master/lib/sanbase/clickhouse/metric/metric_files/available_v2_metrics.json
export const MetricIndex = {};
export const Metric = each(Object.assign({}, FinancialMetric, SocialMetric, DevelopmentMetric, DerivativesMetric, IndicatorsMetric, OnChainMetric, OnChainLabelsMetrics), (metric, key, i) => {
    metric.key = key;
    metric.node = metric.node || Node.LINE;
    MetricIndex[key] = i + 1;
});
export const MvrvTimebounds = newTimebounds(Metric.mvrv_usd);
export const MvrvUsdIntradayTimebounds = newTimebounds(Metric.mvrv_usd_intraday);
const REALIZED_CAP_HODL_WAVES_TIMEBOUNDS = [
    '1d_to_7d',
    '7d_to_30d',
    '30d_to_60d',
    '60d_to_90d',
    '90d_to_180d',
    '180d_to_365d',
    '365d_to_2y',
    '2y_to_3y',
    '3y_to_5y',
    '5y_to_10y',
    '10y_to_20y',
];
export const RealizedCapHodlWavesTimebounds = newTimebounds(Metric.realized_cap_hodl_waves_0d_to_1d, REALIZED_CAP_HODL_WAVES_TIMEBOUNDS, {
    key: 'realized_cap_hodl_waves',
    label: 'Realized Cap HODL Waves',
});
export const RealizedCapTimebounds = newTimebounds(Metric.realized_value_usd);
export const CirculationTimebounds = newTimebounds(Metric.circulation);
export const DormantCirculationTimebounds = newTimebounds(Metric.dormant_circulation_365d, ['90d', '180d', '2y', '3y', '5y'], { key: 'dormant_circulation', label: 'Dormant Circulation' });
const MEAN_AGE_TIMEBOUNDS = ['90d', '180d', '365d', '2y', '3y', '5y'];
export const MeanAgeTimebounds = newTimebounds(Metric.mean_age, MEAN_AGE_TIMEBOUNDS);
export const MeanDollarInvestedAgeTimebounds = newTimebounds(Metric.mean_dollar_invested_age, MEAN_AGE_TIMEBOUNDS);
const ETH2_STAKERS_TIMEBOUNDS = ['2y', '3y', '5y', '10y'];
export const Eth2StakersRealizedTimebounds = newTimebounds(Metric.eth2_stakers_realized_value_usd_365d, ETH2_STAKERS_TIMEBOUNDS, {
    key: Metric.eth2_stakers_realized_value_usd_365d.key.slice(0, -5),
    label: Metric.eth2_stakers_realized_value_usd_365d.label.slice(0, -7),
});
export const Eth2StakersMvrvTimebounds = newTimebounds(Metric.eth2_stakers_mvrv_usd_365d, ETH2_STAKERS_TIMEBOUNDS, {
    key: Metric.eth2_stakers_mvrv_usd_365d.key.slice(0, -5),
    label: Metric.eth2_stakers_mvrv_usd_365d.label.slice(0, -7),
});
Object.assign(Metric, MvrvTimebounds, MvrvUsdIntradayTimebounds, RealizedCapTimebounds, RealizedCapHodlWavesTimebounds, CirculationTimebounds, DormantCirculationTimebounds, MeanAgeTimebounds, MeanDollarInvestedAgeTimebounds, Eth2StakersRealizedTimebounds, Eth2StakersMvrvTimebounds);
//# sourceMappingURL=index.js.map