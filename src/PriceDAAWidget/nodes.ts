import { Metric } from '@/metrics'
import { SelectorType } from '@/metrics/selector/types'

export const PriceDAADivergenceNode = Object.assign(
  {
    selectorType: SelectorType.Widget,
  },
  Metric.price_daa_divergence,
)

export const AdjustedPriceDAADivergenceNode = Object.assign(
  {
    selectorType: SelectorType.Widget,
  },
  Metric.adjusted_price_daa_divergence,
)
