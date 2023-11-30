export function transformRsiSettings(metric: Studio.Metric, metricSettings: Studio.MetricSetting) {
  const baseKey = (metric.base || metric).key
  if (baseKey.includes('rsi_') === false) return

  if (metricSettings.interval || metricSettings.__appliedInterval) return

  metricSettings.interval = (metric.base || metric).defaultInterval
  metricSettings.__appliedInterval = true
}
