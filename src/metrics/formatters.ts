import { millify } from 'webkit/utils/formatting'

const LARGE_NUMBER_THRESHOLD = 99999
export function FORMATTER(value: number) {
  if (!value && value !== 0) {
    return 'No data'
  }

  if (value > LARGE_NUMBER_THRESHOLD) {
    return millify(value, 2)
  }

  if (Math.abs(value) < 1) {
    return value.toFixed(6)
  }

  return Number.isInteger(value) ? value : value.toFixed(2)
}

export function percentFormatter(value: number) {
  const result = FORMATTER(value)
  return Number.isFinite(+result) ? result + '%' : result
}

function normalizeAxisPercent(value: number) {
  if (!Number.isFinite(+value)) return
  const absValue = Math.abs(value)

  if (absValue >= 10) {
    return value.toFixed(2)
  }

  return +value.toFixed(3)
}

export const axisPercentFormatter = (value: number) =>
  normalizeAxisPercent(value) + '%'

const decimalFormatter = new Intl.NumberFormat('en', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const smallDecimalFormatter = new Intl.NumberFormat('en', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
})
export function newCurrencyFormatter(currency: string) {
  return (value: number) => {
    const formatted = (
      Math.abs(value) >= 2 ? decimalFormatter : smallDecimalFormatter
    ).format(value)
    return currency + formatted
  }
}

export const usdFormatter = newCurrencyFormatter('$')
export const btcFormatter = newCurrencyFormatter('BTC ')
export const ethFormatter = newCurrencyFormatter('ETH ')

export const ratioPercentForamtter = (value: number) =>
  percentFormatter(100 * value)
export const ratioPercentAxisFormatter = (value: number) =>
  axisPercentFormatter(100 * value)

export const mvrvFormatter = ratioPercentForamtter
