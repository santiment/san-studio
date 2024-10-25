export function transformMorpho(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
): Studio.MetricSetting {
  if ((metric.base || metric).key === 'morpho_vaults_total_supplied_usd') {
    if (!metricSettings.label_fqn) {
      metricSettings.label_fqn = 'santiment/morpho_vault->steakhouse usdc:v1'
    }
  }

  return metricSettings
}
