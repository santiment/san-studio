import { MetricCategory } from './graph'
import { each } from './utils'
import { usdFormatter, btcFormatter, ethFormatter } from './formatters'
import { Node } from '@/Chart/nodes'

export const FinancialMetric = each(
  {
    price_usd: {
      label: 'Price',
      formatter: usdFormatter,
    },
    price_btc: {
      label: 'Price BTC',
      formatter: btcFormatter,
      checkIsVisible: ({ slug }) => slug !== 'bitcoin',
    },
    price_eth: {
      label: 'Price ETH',
      formatter: ethFormatter,
      checkIsVisible: ({ slug }) => slug !== 'ethereum',
    },
    marketcap_usd: {
      label: 'Marketcap',
      formatter: usdFormatter,
    },
    volume_usd: {
      node: Node.BAR,
      label: 'Volume',
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Financial
  },
)
