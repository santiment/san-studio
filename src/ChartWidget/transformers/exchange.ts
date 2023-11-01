import { Metric } from '@/metrics'
import { isExchangeModifiable } from '../MetricSettings/ExchangeSetting/utils'

export function transformExchangeSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
) {
  if (!isExchangeModifiable(metric)) return
  if ((metric.base || metric).key !== Metric.exchange_open_interest.key) {
    return
  }

  if (metricSettings.owner) return

  const { key, queryKey = key, isRootExchangeKey } = metric as any

  metricSettings.owner = 'binance'
  metricSettings.queryKey = queryKey + (isRootExchangeKey ? '' : '_per_exchange')
}
