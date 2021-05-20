import { MetricCategory } from './graph'
import { each } from './utils'

export const DerivativesMetric = each(
  {
    bitmex_perpetual_basis: {
      label: 'BitMEX Perpetual Contract Basis',
    },
    bitmex_perpetual_basis_ratio: {
      label: 'BitMEX Perpetual Basis Ratio',
    },
    bitmex_perpetual_funding_rate: {
      node: 'filledLine',
      label: 'BitMEX Perpetual Contract Funding Rate',
      // formatter: v => (v ? `${(v * 100).toFixed(2)}%` : 'No data'),
      // axisFormatter: axisPercentFormatter
    },
    bitmex_perpetual_open_interest: {
      label: 'BitMEX Perpetual Contracts Open Interest',
    },
    bitmex_perpetual_open_value: {
      label: 'BitMEX Perpetual Contracts Open Value',
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Derivatives
  },
)
