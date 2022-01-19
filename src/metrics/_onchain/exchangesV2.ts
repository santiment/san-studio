import { each } from '@/metrics/utils'

export const LABELS = [
  'kucoin',
  'poloniex',
  'kraken',
  'binance',
  'bitfinex',
  'gate',
  'bittrex',
  'huobi',
  'coinbase',
  'okex',
  'bitstamp',
] as const

const checkIsVisible = ({ slug }) => slug === 'bitcoin'
const ExchangesV2Metric = {
  labelled_historical_balance: {} as Studio.Metric,
}

const eachLabel = (clb: (label: string, label_fqn: string) => void) =>
  LABELS.forEach((label) => clb(label, `santiment/owner->${label}:v1`))

eachLabel((label, label_fqn) => {
  ExchangesV2Metric['lhb_' + label] = {
    checkIsVisible,
    queryKey: 'labelled_historical_balance',
    label: `${label} Historical Balance`,
    reqMeta: { label_fqn },
  }
})

eachLabel((label, label_fqn) => {
  ExchangesV2Metric['lhbc_' + label] = {
    checkIsVisible,
    queryKey: 'labelled_historical_balance_changes',
    label: `${label} Historical Balance Changes`,
    reqMeta: { label_fqn },
  }
})

each(
  ExchangesV2Metric,
  (metric: Studio.Metric) => (metric.group = 'Exchanges 2.0'),
)

export { ExchangesV2Metric }
