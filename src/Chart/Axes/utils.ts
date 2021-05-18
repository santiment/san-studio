import { millify } from 'webkit/utils/formatting'

export const MULTI_AXIS_WIDTH = 50

// NOTE: http://stackoverflow.com/a/3943023/112731 [@vanguard | Mar  9, 2021]
export function getBubbleFontColorHex(color: string, isNightMode = false) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  const threshold = 175 - (isNightMode ? 37 : 0)
  return r * 0.299 + g * 0.587 + b * 0.114 > threshold ? '#000000' : '#ffffff'
}

export function getBubbleTheme(theme: any, color: string) {
  return Object.assign({}, theme.bubbles, {
    bgColor: color,
    textColor: getBubbleFontColorHex(color),
  })
}

export function yAxisFormatter(value: number) {
  const absValue = Math.abs(value)

  if (!value) {
    return 0
  }

  if (absValue < 1) {
    return +value.toFixed(3)
  }

  if (absValue < 100) {
    return millify(value, 3)
  }

  if (absValue > 999999) {
    return millify(value, 2)
  }

  if (absValue > 99999) {
    return millify(value, 0)
  }

  if (absValue > 9999) {
    return millify(value, 1)
  }

  return Math.trunc(value)
}

export function getMetricAxisFormatter(metricSettings, key) {
  return metricSettings[key].axisFormatter || yAxisFormatter
}
