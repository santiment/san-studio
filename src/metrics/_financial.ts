import { MetricCategory } from './graph'
import { each } from './utils'
import { usdFormatter, btcFormatter, ethFormatter } from './formatters'
import { Node } from '@/Chart/nodes'

const NFTPrices = each(
  {
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
  },
  (metric: any) => {
    metric.isNFTMetric = true
  },
)

const PriceVolatilityMetric = each(
  {
    price_volatility_1d: { label: 'Price Volatility 1d' },
    price_volatility_1w: { label: 'Price Volatility 1w' },
    price_volatility_2w: { label: 'Price Volatility 2w' },
    price_volatility_4w: { label: 'Price Volatility 4w' },
  },
  () => {},
)

const RSIMetric = each(
  {
    rsi_4h: { label: 'RSI 4h', defaultInterval: '4h' },
    rsi_1d: { label: 'RSI 1d', defaultInterval: '1d' },
    rsi_7d: { label: 'RSI 7d', defaultInterval: '7d' },
  },
  () => {},
)

const BTCSnPPriceDivergenceMetric = each(
  {
    btc_s_and_p_price_divergence: { label: 'BTC and S&P 500 Price Divergence' },
  },
  () => {},
)

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
    etf_volume_usd_5m: {
      node: Node.BAR,
      label: 'ETF Volume',
    },
    money_supply: {
      label: 'Money Supply',
    },
    ...PriceVolatilityMetric,
    ...RSIMetric,
    ...BTCSnPPriceDivergenceMetric,
    ...NFTPrices,
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Financial
  },
)
