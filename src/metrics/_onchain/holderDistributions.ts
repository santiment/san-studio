import type { Node } from '@/metrics/utils'
import { MetricCategory } from '@/metrics/graph'
import { percentFormatter, axisPercentFormatter } from '@/metrics/formatters'

const HOLDER_DISTRIBUTIONS = [
  ['_0_to_0001', '[0 - 0.001) coins', '_0_to_0.001'],
  ['_0001_to_001', '[0.001 - 0.01) coins', '_0.001_to_0.01'],
  ['_001_to_01', '[0.01 - 0.1) coins', '_0.01_to_0.1'],
  ['_01_to_1', '[0.1 - 1) coins', '_0.1_to_1'],
  ['_1_to_10', '[1 - 10) coins'],
  ['_10_to_100', '[10 - 100) coins'],
  ['_100_to_1k', '[100 - 1,000) coins'],
  ['_1k_to_10k', '[1,000 - 10,000) coins'],
  ['_10k_to_100k', '[10,000 - 100,000) coins'],
  ['_100k_to_1M', '[100,000  - 1,000,000) coins'],
  ['_1M_to_10M', '[1,000,000 - 10,000,000) coins'],
  ['_10M_to_inf', '[10,000,000 - infinity) coins'],
] as const

type HolderDistributions<T extends string> = {
  [K in typeof HOLDER_DISTRIBUTIONS[number][0] as `${T}${K}`]: Node<
    Studio.Metric,
    `${T}${K}`
  >
}

function buildMetrics<T extends string>(
  templateKey: T,
  type?: any,
  labelPostfix = '',
  formatter?: any,
  axisFormatter?: any,
): HolderDistributions<T> {
  const Metric = {} as HolderDistributions<T>
  HOLDER_DISTRIBUTIONS.forEach(([postfix, label, queryKeyPostfix]) => {
    const key = templateKey + postfix
    const queryKey = queryKeyPostfix && templateKey + queryKeyPostfix
    Metric[key] = {
      key,
      type,
      formatter,
      axisFormatter,
      queryKey,
      label: label + labelPostfix,
      category: MetricCategory.OnChain,
    }
  })
  return Metric
}

export const HolderDistributionAbsoluteMetric = buildMetrics(
  'holders_distribution',
)
export const HolderDistributionBalancePercentMetric = buildMetrics(
  'percent_of_holders_distribution_combined_balance',
  'percent',
  ' %',
  percentFormatter,
  axisPercentFormatter,
)
export const HolderDistributionBalanceAbsoluteMetric = buildMetrics(
  'holders_distribution_combined_balance',
)

export const HoldersLabeledDistributionMetric = buildMetrics(
  'holders_labeled_distribution',
)

export const HolderDistributionMetric = {
  ...HolderDistributionAbsoluteMetric,
  ...HolderDistributionBalancePercentMetric,
  ...HolderDistributionBalanceAbsoluteMetric,
  ...HoldersLabeledDistributionMetric,
}

export const HOLDER_DISTRIBUTION_ABSOLUTE_METRICS = Object.values(
  HolderDistributionAbsoluteMetric,
)
export const LABELED_HOLDER_DISTRIBUTION_METRICS = Object.values(
  HoldersLabeledDistributionMetric,
)

export const HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS = Object.values(
  HolderDistributionBalanceAbsoluteMetric,
)

export const HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS = Object.values(
  HolderDistributionBalancePercentMetric,
)
