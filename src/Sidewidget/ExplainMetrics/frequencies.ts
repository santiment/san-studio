import { Metric } from '@/metrics'

const link = (path, children) =>
  `<a class="btn" target="_blank" rel="noopener noreferrer" href="https://academy.santiment.net/${path}"{href}>${children}</a>`

const FIVE_MINUTE = link(
  '/metrics/details/frequency#five-minute-frequency',
  'Five-Minute Intervals',
)
const DAILY = link('/metrics/details/frequency#daily-frequency', 'Daily Intervals')

const HOURLY = link('/metrics/details/frequency#hourly-frequency', 'Hourly Intervals')

const SENTIMENT = `We store each of the ${link(
  'metrics/details/social-data',
  'social data',
)} documents with its absolute timestamp. I.e. it is possible to aggregate the data with any desired interval ${link(
  'products-and-plans/access-plans/',
  'on request',
)}. Currently the time intervals we use are the following: 6h, 12h, 1d.`

const METRICS = [
  [
    FIVE_MINUTE,
    [
      Metric.age_consumed,
      Metric.dev_activity,
      Metric.exchange_inflow,
      Metric.exchange_outflow,
      Metric.exchange_balance,
      Metric.price_usd,
      Metric.price_btc,
      Metric.price_eth,
      Metric.volume_usd,
      Metric.marketcap_usd,
      Metric.social_dominance_total,
      Metric.social_volume_total,
    ],
  ],

  [HOURLY, [Metric.defi_total_value_locked_usd, Metric.active_addresses_1h]],

  [
    DAILY,
    [
      Metric.circulation,
      Metric.daily_active_addresses,
      Metric.active_deposits,
      Metric.mvrv_usd,
      Metric.mvrv_usd_intraday,
      Metric.mean_age,
      Metric.nvt,
      Metric.network_growth,
      Metric.supply_on_exchanges,
      Metric.supply_outside_exchanges,
      Metric.percent_of_total_supply_on_exchanges,
      Metric.realized_value_usd,
      Metric.realized_cap_hodl_waves_0d_to_1d,
      Metric.velocity,
    ],
  ],

  [
    SENTIMENT,
    [
      Metric.sentiment_positive_total,
      Metric.sentiment_positive_reddit,
      Metric.sentiment_positive_telegram,
      Metric.sentiment_positive_twitter,

      Metric.sentiment_negative_total,
      Metric.sentiment_negative_reddit,
      Metric.sentiment_negative_telegram,
      Metric.sentiment_negative_twitter,

      Metric.sentiment_volume_consumed_total,
      Metric.sentiment_volume_consumed_telegram,
      Metric.sentiment_volume_consumed_twitter,
      Metric.sentiment_volume_consumed_reddit,

      Metric.sentiment_balance_reddit,
      Metric.sentiment_balance_telegram,
      Metric.sentiment_balance_twitter,
      Metric.sentiment_balance_total,
    ],
  ],
] as const

export const Frequency = {}
METRICS.forEach(([type, metrics]) => metrics.forEach(({ key }) => (Frequency[key] = type)))
