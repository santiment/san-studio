import { Metric } from './index'
import { each } from './utils'
import { SelectorType } from './selector/types'

const anomalyFormatter = () => 'Anomaly'

export const MetricSignal = {}
export const NotableSignal = each(
  {
    large_exchange_deposit: {
      formatter: () => 'Large Exchange Deposit',
      metric: Metric.exchange_inflow,
    },
    large_exchange_withdrawal: {
      formatter: () => 'Large Exchange Withdrawal',
      metric: Metric.exchange_outflow,
    },
    anomaly_daily_active_addresses: {
      formatter: anomalyFormatter,
      metric: Metric.daily_active_addresses,
    },
    anomaly_active_deposits: {
      formatter: anomalyFormatter,
      metric: Metric.active_deposits,
    },
    anomaly_mvrv_usd_10y: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_10y,
    },
    anomaly_mvrv_usd_5y: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_5y,
    },
    anomaly_mvrv_usd_2y: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_2y,
    },
    anomaly_mvrv_usd_365d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_365d,
    },
    anomaly_mvrv_usd_180d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_180d,
    },
    anomaly_mvrv_usd_90d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_90d,
    },
    anomaly_mvrv_usd_60d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_60d,
    },
    anomaly_mvrv_usd_30d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_30d,
    },
    anomaly_mvrv_usd_7d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_7d,
    },
    anomaly_mvrv_usd_1d: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_usd_1d,
    },
    anomaly_mvrv_usd_long_short_diff: {
      formatter: anomalyFormatter,
      metric: Metric.mvrv_long_short_diff_usd,
    },
    anomaly_network_growth: {
      formatter: anomalyFormatter,
      metric: Metric.network_growth,
    },
    anomaly_token_velocity: {
      formatter: anomalyFormatter,
      metric: Metric.velocity,
    },
    anomaly_transaction_volume: {
      formatter: anomalyFormatter,
      metric: Metric.transaction_volume,
    },

    price_usd_all_time_high: {
      formatter: () => 'All Time High',
      metric: Metric.price_usd,
    },
    dai_mint: {
      formatter: () => 'DAI mint',
      metric: Metric.circulation_10y,
    },
    large_transactions: {
      formatter: () => 'Large Transactions',
      metric: Metric.transaction_volume,
    },

    old_coins_moved: {
      formatter: () => 'Old Coins Moved',
      metric: Metric.age_consumed,
    },
    project_in_trends_words: {
      formatter: () => 'Project in Trends',
      metric: Metric.social_volume_total,
    },
  },
  (notable: any, key) => {
    notable.key = key
    MetricSignal[notable.metric.key] = notable
  },
)

export function getNotableItem(signal) {
  return {
    key: signal.key,
    metric: signal.metric,
    label: signal.formatter(),
    selectorType: SelectorType.Notable,
  }
}
