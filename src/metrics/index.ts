import { FinancialMetric } from './_financial'
import { SocialMetric } from './_social'
import { DevelopmentMetric } from './_development'
import { DerivativesMetric } from './_derivatives'
import { OnChainMetric } from './_onchain'
import { IndicatorsMetric } from './_indicators'
import { newTimebounds } from './timebounds'
import { each } from './utils'
import { Node } from '@/Chart/nodes'

export const MetricIndex = {}
export const Metric = each(
  Object.assign(
    {},
    FinancialMetric,
    SocialMetric,
    DevelopmentMetric,
    DerivativesMetric,
    OnChainMetric,
    IndicatorsMetric,
  ),
  (metric: Studio.Metric, key, i) => {
    metric.key = key
    metric.node = metric.node || Node.LINE

    MetricIndex[key] = i + 1
  },
)

export const MvrvTimebounds = newTimebounds(Metric.mvrv_usd)
export const MvrvUsdIntradayTimebounds = newTimebounds(Metric.mvrv_usd_intraday)
export const RealizedCapTimebounds = newTimebounds(Metric.realized_value_usd)
Object.assign(
  Metric,
  MvrvTimebounds,
  MvrvUsdIntradayTimebounds,
  RealizedCapTimebounds,
)
