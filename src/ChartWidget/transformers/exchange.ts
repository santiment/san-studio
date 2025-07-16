import { Metric } from '@/metrics'
import { isExchangeModifiable } from '../MetricSettings/ExchangeSetting/utils'

export function transformExchangeSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
) {
  if (!isExchangeModifiable(metric)) return

  const baseKey = (metric.base || metric).key
  if (
    baseKey !== Metric.exchange_open_interest.key &&
    baseKey !== Metric.funding_rates_aggregated_by_exchange.key
  ) {
    return
  }

  if (metricSettings.owner) return

  const { key, queryKey = key, isRootExchangeKey } = metric as any

  metricSettings.owner = 'binance'
  metricSettings.queryKey = queryKey + (isRootExchangeKey ? '' : '_per_exchange')
}
