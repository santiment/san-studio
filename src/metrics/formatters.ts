import { millify } from 'webkit/utils/formatting'

const LARGE_NUMBER_THRESHOLD = 99999
export function FORMATTER(value: number) {
  if (!value && value !== 0) {
    return 'No data'
  }

  const absValue = Math.abs(value)
  if (absValue > LARGE_NUMBER_THRESHOLD) {
    return millify(value, 2)
  }

  if (Math.abs(absValue) < 1) {
    return +value.toFixed(6)
  }

  return Number.isInteger(value) ? value : value.toFixed(2)
}

export function percentFormatter(value: number) {
  const result = FORMATTER(value)
  const num = +result
  return Number.isFinite(num) ? num + '%' : result
}

function normalizeAxisPercent(value: number) {
  if (!Number.isFinite(+value)) return
  const absValue = Math.abs(value)

  if (absValue >= 10) {
    return value.toFixed(2)
  }

  return +value.toFixed(3)
}

export const axisPercentFormatter = (value: number) => normalizeAxisPercent(value) + '%'

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
    if (!Number.isFinite(+value)) return 'No data'

    const absValue = Math.abs(value)
    const formatted = getDecimalFormatter(absValue).format(absValue)
    const sign = absValue !== value ? '-' : ''

    return sign + currency + formatted
  }
}

function getDecimalFormatter(value: number) {
  if (value < 0.000001) {
    return new Intl.NumberFormat('en', {
      style: 'decimal',
      maximumFractionDigits: 10,
    })
  }

  if (value < 2) return smallDecimalFormatter

  return decimalFormatter
}

export const usdFormatter = newCurrencyFormatter('$')
export const btcFormatter = newCurrencyFormatter('BTC ')
export const ethFormatter = newCurrencyFormatter('ETH ')

export const ratioPercentForamtter = (value: number) => percentFormatter(100 * value)
export const ratioPercentAxisFormatter = (value: number) => axisPercentFormatter(100 * value)

export const mvrvFormatter = ratioPercentForamtter
