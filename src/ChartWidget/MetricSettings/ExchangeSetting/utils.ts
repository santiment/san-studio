import { query } from 'webkit/api'
import { Metric } from '@/metrics'

export const DEFAULT_EXCHANGE = 'All (CEX+DEX)'
export const DEFAULT_EXCHANGES = [DEFAULT_EXCHANGE]

const EXCHANGES_QUERY = (slug: string, isDex: boolean) => `
  {
    allExchanges(slug: "${slug}", isDex: ${isDex})
  }
`

const accessor = ({ allExchanges }) => allExchanges
export function queryProjectExchanges(slug: string, isDex = false): Promise<string[]> {
  return query<any>(EXCHANGES_QUERY(slug, isDex)).then(accessor)
}

export function isExchangeModifiable(metric: Studio.Metric) {
  const { base = metric } = metric
  return (
    base === Metric.exchange_outflow ||
    base === Metric.exchange_inflow ||
    base === Metric.exchange_balance ||
    base === Metric.exchange_open_interest
  )
}
