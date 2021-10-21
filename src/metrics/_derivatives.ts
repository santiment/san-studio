import { MetricCategory } from './graph'
import { ratioPercentForamtter, ratioPercentAxisFormatter } from './formatters'
import { each } from './utils'

export const DerivativesMetric = each(
  {
    bitmex_perpetual_basis: {
      label: 'BitMEX Basis',
    },
    bitmex_perpetual_basis_ratio: {
      label: 'BitMEX Basis Ratio',
    },
    bitmex_perpetual_funding_rate: {
      node: 'filledLine',
      label: 'BitMEX Funding Rate',
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    bitmex_perpetual_open_interest: {
      label: 'BitMEX Open Interest',
    },
    bitmex_perpetual_open_value: {
      label: 'BitMEX Open Value',
    },
    usdt_bnb_funding_rates: {
      label: 'Binance Funding Rate (USDT)',
      node: 'filledLine',
      checkIsVisible: ({ isBeta }) => isBeta,
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    busd_bnb_funding_rates: {
      label: 'Binance Funding Rate (BUSD)',
      node: 'filledLine',
      checkIsVisible: ({ isBeta }) => isBeta,
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    ftx_perpetual_funding_rate: {
      label: 'FTX Funding Rate',
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
      checkIsVisible: ({ isBeta }) => isBeta,
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Derivatives
  },
)
