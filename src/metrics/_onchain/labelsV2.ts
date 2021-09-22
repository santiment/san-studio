import { each } from '@/metrics/utils'

export const LABELS = [
  'KuCoin',
  'Poloniex',
  'Kraken',
  'Binance',
  'Bitfinex',
  'Gate',
  'Bittrex',
  'Huobi',
  'Coinbase',
  'OKEx',
  'Bitstamp',
] as const

const checkIsVisible = ({ slug }) => slug === 'bitcoin'
const ExchangesV2Metric = {
  labelled_historical_balance: {} as Studio.Metric,
}
const LabelsV2Metric = {
  labelled_historical_balance_changes: {} as Studio.Metric,
}

LABELS.forEach((label) => {
  const label_fqn = `santiment/owner->${label}:v1`

  ExchangesV2Metric['lhb_' + label] = {
    checkIsVisible,
    queryKey: 'labelled_historical_balance',
    label: `${label} Historical Balance`,
    reqMeta: { label_fqn },
  }

  LabelsV2Metric['lhbc_' + label] = {
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
each(LabelsV2Metric, (metric: Studio.Metric) => (metric.group = 'Labels 2.0'))

export { ExchangesV2Metric, LabelsV2Metric }
