import { MetricCategory } from './graph'
import { each } from './utils'
import { Node } from '@/Chart/nodes'

export const FinancialMetric = each(
  {
    price_usd: {
      label: 'Price',
      category: 'Financial',
      // formatter: usdFormatter,
    },
    price_btc: {
      label: 'Price BTC',
      category: 'Financial',
      // formatter: btcFormatter,
      checkIsVisible: ({ slug }) => slug !== 'bitcoin',
    },
    price_eth: {
      label: 'Price ETH',
      category: 'Financial',
      // formatter: ethFormatter,
      checkIsVisible: ({ slug }) => slug !== 'ethereum',
    },
    marketcap_usd: {
      label: 'Marketcap',
      // formatter: usdFormatter
    },
    volume_usd: {
      node: Node.BAR,
      label: 'Volume',
      category: 'Financial',
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Financial
  },
)
