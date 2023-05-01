import { query } from 'webkit/api'
import { MetricIndex } from '@/metrics'
import { NO_PROJECT_METRICS } from '@/metrics/withoutProject'

const PROJECT_AVAILABLE_METRIC_QUERY = (slug: string): string => `
  {
    projectBySlug(slug: "${slug}") {
      availableMetrics
      availableQueries
    }
  }
`
type ProjectMetrics = SAN.API.Query<
  'projectBySlug',
  { availableMetrics: string[]; availableQueries: string[] }
>

export const indexSorter = (a: string, b: string) => (MetricIndex[a] || -1) - (MetricIndex[b] || -1)
function precacher() {
  return ({ projectBySlug }) => {
    const { availableMetrics, availableQueries } = projectBySlug
    const metricsSet = new Set(NO_PROJECT_METRICS.concat(availableMetrics).concat(availableQueries))
    return Array.from(metricsSet).sort(indexSorter)
  }
}
const options = { precacher }

const catchMetrics = () => ['price_usd']
export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<string[]> =>
  query<any>(
    // TODO: Remove stablecoins check when backend is ready [@vanguard | Jun  9, 2021]
    PROJECT_AVAILABLE_METRIC_QUERY(slug === 'stablecoins' ? 'tether' : slug),
    options,
  ).catch(catchMetrics) as any

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
