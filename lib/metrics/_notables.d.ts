import { SelectorType } from './selector/types'
export declare const MetricSignal: {}
export declare const NotableSignal: {
  large_exchange_deposit: any
  large_exchange_withdrawal: any
  anomaly_daily_active_addresses: any
  anomaly_active_deposits: any
  anomaly_mvrv_usd_10y: any
  anomaly_mvrv_usd_5y: any
  anomaly_mvrv_usd_2y: any
  anomaly_mvrv_usd_365d: any
  anomaly_mvrv_usd_180d: any
  anomaly_mvrv_usd_90d: any
  anomaly_mvrv_usd_60d: any
  anomaly_mvrv_usd_30d: any
  anomaly_mvrv_usd_7d: any
  anomaly_mvrv_usd_1d: any
  anomaly_mvrv_usd_long_short_diff: any
  anomaly_network_growth: any
  anomaly_token_velocity: any
  anomaly_transaction_volume: any
  price_usd_all_time_high: any
  dai_mint: any
  large_transactions: any
  old_coins_moved: any
  project_in_trending_words: any
}
export declare function getNotableItem(signal: any): {
  key: any
  metric: any
  label: any
  selectorType: SelectorType
}
