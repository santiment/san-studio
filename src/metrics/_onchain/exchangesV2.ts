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

export const DISPLAY_LABELS: Partial<Record<(typeof LABELS)[number], string>> = {
  OKEx: 'OKX',
}

const ExchangesV2Metric = {
  labelled_historical_balance: { label: '' } as Studio.Metric,
}

const eachLabel = (clb: (label: string, label_fqn: string) => void) =>
  LABELS.forEach((label) => clb(label, `santiment/owner->${label.toLowerCase()}:v1`))

eachLabel((label, label_fqn) => {
  ExchangesV2Metric['lhb_' + label] = {
    queryKey: 'labelled_historical_balance',
    label: `${DISPLAY_LABELS[label] ?? label} Historical Balance`,
    reqMeta: { label_fqn },
  }
})

eachLabel((label, label_fqn) => {
  ExchangesV2Metric['lhbc_' + label] = {
    queryKey: 'labelled_historical_balance_changes',
    label: `${DISPLAY_LABELS[label] ?? label} Historical Balance Changes`,
    reqMeta: { label_fqn },
  }
})

each(ExchangesV2Metric, (metric: Studio.Metric) => (metric.group = 'Exchanges 2.0'))

export { ExchangesV2Metric }
