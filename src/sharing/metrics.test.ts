import {
  buildIndicatorMetric,
  Indicator,
} from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'
import { buildMergedMetric } from '@/HolderDistributionWidget/utils'
import { Metric } from '@/metrics'
import { MetricType, newKey, newProjectMetric } from '@/metrics/utils'
import {
  HolderDistributionMetric,
  HOLDERS_DISTRIBUTION,
} from '@/metrics/_onchain/holderDistributions'
import { parseMetric, shareMetrics } from './metrics'

describe('Share', () => {
  it('Basic metric', () => {
    expect(shareMetrics([Metric.price_usd])).toEqual([Metric.price_usd.key])
  })

  it('Project locked', () => {
    const metric = newProjectMetric({ slug: 'bitcoin', ticker: 'BTC' }, Metric.price_usd)

    expect(shareMetrics([metric])).toEqual([`[1;${Metric.price_usd.key};bitcoin;BTC]`])
  })

  it('Indicator(MA_7)', () => {
    const metric = buildIndicatorMetric(Metric.price_usd, Indicator.MA7)
    expect(shareMetrics([metric])).toEqual([`[2;${Metric.price_usd.key};MA7]`])
  })

  it('Project Locked Indicator(MA_7)', () => {
    const projectMetric = newProjectMetric({ slug: 'bitcoin', ticker: 'BTC' }, Metric.price_usd)

    const metric = buildIndicatorMetric(projectMetric, Indicator.MA7)
    expect(shareMetrics([metric])).toEqual([`[2;[1;${Metric.price_usd.key};bitcoin;BTC];MA7]`])
  })

  it('Merged Supply Distribution', () => {
    const metric = buildMergedMetric([
      HolderDistributionMetric.holders_distribution_01_to_1,
      HolderDistributionMetric.holders_distribution_1_to_10,
    ])

    expect(shareMetrics([metric])).toEqual([`[3;${HOLDERS_DISTRIBUTION};01_to_1;1_to_10]`])
  })

  it('Project Locked Merged Supply Distribution', () => {
    const metric = buildMergedMetric([
      HolderDistributionMetric.holders_distribution_01_to_1,
      HolderDistributionMetric.holders_distribution_1_to_10,
    ])
    const projectMetric = newProjectMetric({ slug: 'bitcoin', ticker: 'BTC' }, metric)

    expect(shareMetrics([projectMetric])).toEqual([
      `[1;[3;${HOLDERS_DISTRIBUTION};01_to_1;1_to_10];bitcoin;BTC]`,
    ])
  })
})

describe.only('Parse', () => {
  it('Basic metric', () => {
    const key = 'price_usd'
    expect(parseMetric(key)).toEqual(Metric.price_usd)
  })

  it('Project locked', () => {
    const key = `[1;price_usd;bitcoin;BTC]`
    expect(parseMetric(key)).toEqual(
      newProjectMetric({ slug: 'bitcoin', ticker: 'BTC' }, Metric.price_usd),
    )
  })

  it('Indicator(MA_7)', () => {
    const key = `[2;price_usd;MA7]`
    expect(parseMetric(key)).toEqual(buildIndicatorMetric(Metric.price_usd, Indicator.MA7))
  })

  it('Project locked Indicator(MA_7)', () => {
    const key = `[2;[1;price_usd;bitcoin;BTC];MA7]`
    expect(parseMetric(key)).toEqual(
      buildIndicatorMetric(
        newProjectMetric({ slug: 'bitcoin', ticker: 'BTC' }, Metric.price_usd),
        Indicator.MA7,
      ),
    )
  })

  it('Merged Supply Distribution', () => {
    const key = `[3;${HOLDERS_DISTRIBUTION};01_to_1;1_to_10]`

    expect(parseMetric(key)).toEqual(
      buildMergedMetric([
        HolderDistributionMetric.holders_distribution_01_to_1,
        HolderDistributionMetric.holders_distribution_1_to_10,
      ]),
    )
  })

  it('Project Locked Merged Supply Distribution', () => {
    const key = `[1;[3;${HOLDERS_DISTRIBUTION};01_to_1;1_to_10];bitcoin;BTC]`

    expect(parseMetric(key)).toEqual(
      newProjectMetric(
        { slug: 'bitcoin', ticker: 'BTC' },
        buildMergedMetric([
          HolderDistributionMetric.holders_distribution_01_to_1,
          HolderDistributionMetric.holders_distribution_1_to_10,
        ]),
      ),
    )
  })
})
