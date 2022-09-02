import { millify } from 'san-webkit/lib/utils/formatting'
const LARGE_NUMBER_THRESHOLD = 99999
export function FORMATTER(value) {
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
export function percentFormatter(value) {
  const result = FORMATTER(value)
  const num = +result
  return Number.isFinite(num) ? num + '%' : result
}
function normalizeAxisPercent(value) {
  if (!Number.isFinite(+value)) return
  const absValue = Math.abs(value)
  if (absValue >= 10) {
    return value.toFixed(2)
  }
  return +value.toFixed(3)
}
export const axisPercentFormatter = (value) => normalizeAxisPercent(value) + '%'
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
export function newCurrencyFormatter(currency) {
  return (value) => {
    if (!Number.isFinite(+value)) return 'No data'
    const absValue = Math.abs(value)
    const formatted = (absValue >= 2 ? decimalFormatter : smallDecimalFormatter).format(absValue)
    const sign = absValue !== value ? '-' : ''
    return sign + currency + formatted
  }
}
export const usdFormatter = newCurrencyFormatter('$')
export const btcFormatter = newCurrencyFormatter('BTC ')
export const ethFormatter = newCurrencyFormatter('ETH ')
export const ratioPercentForamtter = (value) => percentFormatter(100 * value)
export const ratioPercentAxisFormatter = (value) => axisPercentFormatter(100 * value)
export const mvrvFormatter = ratioPercentForamtter
//# sourceMappingURL=formatters.js.map
