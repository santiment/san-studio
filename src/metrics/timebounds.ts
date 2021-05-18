const TIMEBOUNDS = [
  '1d',
  '7d',
  '30d',
  '60d',
  '90d',
  '180d',
  '365d',
  '2y',
  '3y',
  '5y',
  '10y',
]

export function newTimebound(metric: any, timebound: string) {
  const { key, label } = metric
  return Object.assign({}, metric, {
    key: `${key}_${timebound}`,
    label: `${label} (${timebound})`,
  })
}

export function newTimebounds(metric) {
  const Timebounds = {}
  TIMEBOUNDS.forEach((timebound) => {
    const timeboundMetric = newTimebound(metric, timebound)
    Timebounds[timeboundMetric.key] = timeboundMetric
  })
  return Timebounds
}
