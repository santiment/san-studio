import { MetricCategory } from './graph'
import { each } from './utils'
import { usdFormatter, btcFormatter, ethFormatter } from './formatters'
import { Node } from '@/Chart/nodes'

const NFTPrices = {
  nft_collection_min_price: {
    label: 'Minimum Daily Price of NFT Collections in ETH',
  },
  nft_collection_max_price: {
    label: 'Maximum Daily Price of NFT Collections in ETH',
  },
  nft_collection_avg_price: {
    label: 'Average Daily Price of NFT Collections in ETH',
  },
  nft_collection_min_price_usd: {
    label: 'Minimum Daily Price of NFT Collections in USD',
  },
  nft_collection_max_price_usd: {
    label: 'Maximum Daily Price of NFT Collections in USD',
  },
  nft_collection_avg_price_usd: {
    label: 'Average Daily Price of NFT Collections in USD',
  },
}

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
    ...NFTPrices,
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Financial
  },
)
