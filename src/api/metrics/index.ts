import { query } from 'webkit/api'
import { MetricIndex } from '@/metrics'
import { NO_PROJECT_METRICS } from '@/metrics/withoutProject'
import { createDynamicLabelFqnMetric } from '@/metrics/_onchain_labels/labelFqn'

const PROJECT_AVAILABLE_METRIC_QUERY = (slug: string): string => `
  {
    projectBySlug(slug: "${slug}") {
      availableMetrics
      availableQueries
      availableMetricsExtended {
        metric
        docs { link }
      }
      availableLabelFqns {
        displayName
        labelFqn
      }
    }
  }
`
type ProjectMetrics = SAN.API.Query<
  'projectBySlug',
  { availableMetrics: string[]; availableQueries: string[] }
>

export const indexSorter = (a: string, b: string) => (MetricIndex[a] || -1) - (MetricIndex[b] || -1)

function precacher({ slug } = { slug: 'bitcoin' }) {
  return ({ projectBySlug }) => {
    const { availableMetrics, availableQueries, availableMetricsExtended, availableLabelFqns } =
      projectBySlug
    const metricsSet = new Set(NO_PROJECT_METRICS.concat(availableMetrics).concat(availableQueries))

    // TODO: Remove after Backend add supports for checking label_fqn in supported metrics
    if (metricsSet.has('labelled_historical_balance')) {
      metricsSet.add('amount_in_funds')
      metricsSet.add('amount_in_bridges')
      metricsSet.add('amount_in_lendings')
      metricsSet.add('amount_in_miners')
    }

    if (availableLabelFqns.length) {
      availableLabelFqns.forEach((item) => {
        // TODO: Displaying whale_usd_balance labelFqn metric until Alex G. approves other metrics
        if (!item.labelFqn.includes('whale_usd_balance')) return

        const metric = createDynamicLabelFqnMetric(slug, item.labelFqn, item.displayName)

        if (metric) metricsSet.add(metric.key)
      })
    }

    const MetricDocs = availableMetricsExtended.reduce((acc, item) => {
      if (!item.docs) return acc

      const doc = item.docs.find((doc) => !!doc.link)
      if (!doc) return acc

      acc[item.metric] = `Academy <a target="_blank" href="${doc.link}">article</a>`

      return acc
    }, {})

    return { metrics: Array.from(metricsSet).sort(indexSorter), docs: MetricDocs }
  }
}

export const FIAT_FUND_ASSETS = [
  { slug: 'arkb', name: 'Ark BTC ETF', ticker: 'ARKB' },
  { slug: 'bitb', name: 'Bitwise BTC ETF', ticker: 'BITB' },
  { slug: 'brrr', name: 'Valkyrie BTC ETF', ticker: 'BRRR' },
  { slug: 'bsol', name: 'Bitwise Solana Staking ETF', ticker: 'BWSOL' },
  { slug: 'btc', name: 'Grayscale BTC ETF mini', ticker: 'BTC' },
  { slug: 'btco', name: 'Invesco BTC ETF', ticker: 'BTCO' },
  { slug: 'btcw', name: 'WTree BTC ETF', ticker: 'BTCW' },
  { slug: 'eth', name: 'Grayscale Ethereum Mini Trust ETF', ticker: 'ETH' },
  { slug: 'etha', name: 'iShares Ethereum Trust ETF', ticker: 'ETHA' },
  { slug: 'ethe', name: 'Grayscale Ethereum Trust ETF', ticker: 'ETHE' },
  { slug: 'ethv', name: 'VanEck Ethereum ETF', ticker: 'ETHV' },
  { slug: 'ezbtc', name: 'Franklin BTC ETF', ticker: 'EZBC' },
  { slug: 'ethw', name: 'Bitwise Ethereum ETF', ticker: 'ETHW' },
  { slug: 'ezet', name: 'Franklin Ethereum ETF', ticker: 'EZET' },
  { slug: 'fbtc', name: 'Fidelity BTC ETF', ticker: 'FBTC' },
  { slug: 'feth', name: 'Fidelity Ethereum Fund', ticker: 'FETH' },
  { slug: 'fsol', name: 'Fidelity Solana Fund ETF', ticker: 'FSOL' },
  { slug: 'gbtc', name: 'Grayscale BTC ETF', ticker: 'GBTC' },
  { slug: 'gsol', name: 'Grayscale Solana Trust ETF', ticker: 'GSOL' },
  { slug: 'hodl', name: 'VanEck BTC ETF', ticker: 'HODL' },
  { slug: 'ibit', name: 'Blackrock BTC ETF', ticker: 'IBIT' },
  { slug: 'qeth', name: 'Invesco Galaxy Ethereum ETF', ticker: 'QETH' },
  { slug: 'teth', name: '21Shares Ethereum ETF', ticker: 'TETH' },
  { slug: 'tsol', name: '21Shares Solana ETF', ticker: 'TSOL' },
  { slug: 'vsol', name: 'VanEck Solana ETF', ticker: 'VSOL' },
]

export const FIAT_MONEY_SUPPLY_ASSETS = [{ slug: 'm2-money', name: 'M2 Money', ticker: 'M2M' }]

const catchMetrics = () => ({ metrics: ['price_usd'], docs: {} })
export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<{ metrics: string[]; docs: Record<string, null | string> }> => {
  const fundSet = new Set(FIAT_FUND_ASSETS.map((v) => v.slug))

  if (fundSet.has(slug)) {
    return Promise.resolve({ metrics: ['etf_volume_usd_5m'], docs: {} })
  }

  const moneySet = new Set(FIAT_MONEY_SUPPLY_ASSETS.map((v) => v.slug))
  if (moneySet.has(slug)) {
    return Promise.resolve({ metrics: ['money_supply'], docs: {} })
  }

  return query<any>(
    // TODO: Remove stablecoins check when backend is ready [@vanguard | Jun  9, 2021]
    PROJECT_AVAILABLE_METRIC_QUERY(slug === 'stablecoins' ? 'tether' : slug),
    { precacher, variables: { slug } },
  ).catch(catchMetrics) as any
}

// TODO: Ask backend to provide avaiableMetrics for addresses
const ADDRESS_METRICS = [
  'nft_collection_min_price',
  'nft_collection_max_price',
  'nft_collection_avg_price',
  'nft_collection_min_price_usd',
  'nft_collection_max_price_usd',
  'nft_collection_avg_price_usd',

  'nft_collection_trades_count',

  'contract_transactions_count',
  'contract_interacting_addresses_count',
  'nft_social_volume',
]
export const queryAddressMetrics = (_address: string) => Promise.resolve(ADDRESS_METRICS)
