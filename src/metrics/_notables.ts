import { Metric } from './index'

export const NotableMetric = {
  large_exchange_deposit: Metric.exchange_inflow,
  large_exchange_withdrawal: Metric.exchange_outflow,
}
export const MetricSignal = {}
Object.keys(NotableMetric).forEach((key) => {
  MetricSignal[NotableMetric[key].key] = key
})
