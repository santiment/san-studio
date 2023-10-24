import { isExchangeModifiable } from '../MetricSettings/ExchangeSetting/utils'

export function transformExchangeSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
) {
  if (!isExchangeModifiable(metric)) return

  if (metricSettings.owner) return

  const { key, queryKey = key, isRootExchangeKey } = metric as any

  metricSettings.owner = 'binance'
  metricSettings.queryKey = queryKey + (isRootExchangeKey ? '' : '_per_exchange')
}
