import { query } from 'webkit/api'
import { Metric } from '@/metrics'

const DEFAULT_EXCHANGE = 'Auto (CEX+DEX)'
const DEFAULT_EXCHANGE_OPEN_INTEREST = 'Auto (Binance)'

export const ExchangeMetricsDefaults = {
  label: DEFAULT_EXCHANGE,
  owners: [DEFAULT_EXCHANGE],
  onDefault: (MetricSettings: any, key: string) => {
    MetricSettings.delete(key, 'queryKey')
    MetricSettings.delete(key, 'owner')
  },
}
export const OpenInterestMetricsDefaults = {
  label: DEFAULT_EXCHANGE_OPEN_INTEREST,
  owners: [DEFAULT_EXCHANGE_OPEN_INTEREST],
  onDefault: (MetricSettings: any, key: string) => {
    MetricSettings.set(key, { owner: 'binance' })
  },
}

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
