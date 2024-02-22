import { FinancialMetric } from './_financial'
import { SocialMetric } from './_social'
import { DevelopmentMetric } from './_development'
import { DerivativesMetric } from './_derivatives'
import { OnChainMetric } from './_onchain'
import { IndicatorsMetric } from './_indicators'
import { newTimebounds } from './timebounds'
import { each } from './utils'
import { Node } from '@/Chart/nodes'

// NOTE: https://github.com/santiment/sanbase2/blob/master/lib/sanbase/clickhouse/metric/metric_files/available_v2_metrics.json

export const MetricIndex = {}
export const Metric = each(
  Object.assign(
    {},
    FinancialMetric,
    SocialMetric,
    DevelopmentMetric,
    DerivativesMetric,
    IndicatorsMetric,
    OnChainMetric,
  ),
  (metric: Studio.Metric, key, i) => {
    metric.key = key
    metric.node = metric.node || Node.LINE

    MetricIndex[key] = i + 1
  },
)

export const MvrvTimebounds = newTimebounds(Metric.mvrv_usd)
export const MvrvUsdIntradayTimebounds = newTimebounds(Metric.mvrv_usd_intraday)
export const RealizedCapHodlWavesTimebounds = newTimebounds(Metric.realized_cap_hodl_waves)
export const RealizedCapTimebounds = newTimebounds(Metric.realized_value_usd)
export const CirculationTimebounds = newTimebounds(Metric.circulation)
export const DormantCirculationTimebounds = newTimebounds(
  Metric.dormant_circulation_365d,
  ['90d', '180d', '2y', '3y', '5y'],
  { key: 'dormant_circulation', label: 'Dormant Circulation' },
)

const MEAN_AGE_TIMEBOUNDS = ['90d', '180d', '365d', '2y', '3y', '5y']
export const MeanAgeTimebounds = newTimebounds(Metric.mean_age, MEAN_AGE_TIMEBOUNDS)
export const MeanDollarInvestedAgeTimebounds = newTimebounds(
  Metric.mean_dollar_invested_age,
  MEAN_AGE_TIMEBOUNDS,
)

const ETH2_STAKERS_TIMEBOUNDS = ['2y', '3y', '5y', '10y']
export const Eth2StakersRealizedTimebounds = newTimebounds(
  Metric.eth2_stakers_realized_value_usd_365d,
  ETH2_STAKERS_TIMEBOUNDS,
  {
    key: Metric.eth2_stakers_realized_value_usd_365d.key.slice(0, -5),
    label: Metric.eth2_stakers_realized_value_usd_365d.label.slice(0, -7),
  },
)
export const Eth2StakersMvrvTimebounds = newTimebounds(
  Metric.eth2_stakers_mvrv_usd_365d,
  ETH2_STAKERS_TIMEBOUNDS,
  {
    key: Metric.eth2_stakers_mvrv_usd_365d.key.slice(0, -5),
    label: Metric.eth2_stakers_mvrv_usd_365d.label.slice(0, -7),
  },
)

Object.assign(
  Metric,
  MvrvTimebounds,
  MvrvUsdIntradayTimebounds,
  RealizedCapTimebounds,
  RealizedCapHodlWavesTimebounds,
  CirculationTimebounds,
  DormantCirculationTimebounds,
  MeanAgeTimebounds,
  MeanDollarInvestedAgeTimebounds,
  Eth2StakersRealizedTimebounds,
  Eth2StakersMvrvTimebounds,
)
