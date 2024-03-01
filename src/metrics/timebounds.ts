const TIMEBOUNDS = ['1d', '7d', '30d', '60d', '90d', '180d', '365d', '2y', '3y', '5y', '10y']

export function newTimebound(
  metric: Studio.Metric,
  timebound: string,
  overwrite: Partial<Studio.Metric> = {},
) {
  const { key, label } = metric
  return Object.assign({}, metric, {
    key: `${overwrite.key || key}_${timebound}`,
    label: `${overwrite.label || label} (${timebound.replace(/_/g, ' ')})`,
  })
}

export function newTimebounds(
  metric: Studio.Metric,
  timebounds = TIMEBOUNDS,
  overwrite: Partial<Studio.Metric> = {},
) {
  const Timebounds = {}
  timebounds.forEach((timebound) => {
    const timeboundMetric = newTimebound(metric, timebound, overwrite)
    Timebounds[timeboundMetric.key] = timeboundMetric
  })
  return Timebounds
}
