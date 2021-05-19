import { millify } from 'webkit/utils/formatting'

const LARGE_NUMBER_THRESHOLD = 99999
export function FORMATTER(value: number) {
  if (!value && value !== 0) {
    return 'No data'
  }

  if (value > LARGE_NUMBER_THRESHOLD) {
    return millify(value, 2)
  }

  if (value < 1) {
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

  if (value >= 10) {
    return value.toFixed(2)
  }

  return value.toFixed(3)
}

export const axisPercentFormatter = (value) => normalizeAxisPercent(value) + '%'
