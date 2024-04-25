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
        const metric = createDynamicLabelFqnMetric(slug, item.labelFqn, item.displayName)

        metricsSet.add(metric.key)
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
  { slug: 'gbtc', name: 'GBTC', ticker: 'GBTC' },
  { slug: 'ibit', name: 'IBIT', ticker: 'IBIT' },
  { slug: 'fbtc', name: 'FBTC', ticker: 'FBTC' },
  { slug: 'arkb', name: 'ARKB', ticker: 'ARKB' },
  { slug: 'btco', name: 'BTCO', ticker: 'BTCO' },
  { slug: 'bitb', name: 'BITB', ticker: 'BITB' },
]

const catchMetrics = () => ['price_usd']
export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<{ metrics: string[]; docs: Record<string, null | string> }> => {
  const fundSet = new Set(FIAT_FUND_ASSETS.map((v) => v.slug))

  if (fundSet.has(slug)) {
    return Promise.resolve({ metrics: ['etf_volume_usd_5m'], docs: {} })
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
