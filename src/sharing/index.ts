import { normalizeIds } from './utils'

export type Metric = {
  key: string
  label: string
  expression?: string
  base?: any
}
export type CombinedMetric = Metric & {
  baseMetrics: Metric[]
}

type MetricAlias = {
  [metricKey: string]: string
}
const checkIsEmptyObject = (obj: { [key: string]: any }) => Object.keys(obj).length === 0

export function newURLQuery(obj: {
  [key: string]: undefined | number | string | string[]
}): string {
  let searchString = ''

  for (let key in obj) {
    const value = obj[key]
    if (value === undefined || (value as string).length === 0) continue
    if (value === '[]' || value === '{}') continue
    const encodedValue = encodeURIComponent(Array.isArray(value) ? value.join(';') : value)
    if (encodedValue === '') continue
    searchString += `&${encodeURIComponent(key)}=${encodedValue}`
  }

  return searchString.slice(1)
}

const keyAccessor = ({ key }: Metric) => key
export const shareMetrics = (metrics: Metric[]) => metrics.map(keyAccessor)

export function newMetricAlias(metricKeys: string[]): MetricAlias {
  const metricAlias = {}
  for (let i = metricKeys.length - 1; i > -1; i--) {
    metricAlias[metricKeys[i]] = i
  }
  return metricAlias
}
export function eachAlias<T>(
  keys: string[],
  metricAlias: MetricAlias,
  clb: (metricKey: string) => T,
) {
  const { length } = keys
  const result = new Array(length) as T[]
  for (let i = 0; i < length; i++) {
    const key = keys[i]
    result[metricAlias[key]] = clb(key)
  }
  return result
}

export const shareAxesMetrics = (
  axesMetrics: Metric[] | undefined,
  accessor = keyAccessor,
): string[] => normalizeIds(Array.from(axesMetrics || []).map(accessor))

export const shareColors = (
  colors: { [metricKey: string]: string },
  metricAlias: MetricAlias,
): string[] => eachAlias(Object.keys(colors || {}), metricAlias, (key) => colors[key])

export function shareMetricSettings(
  settings: { [metricKey: string]: any },
  metricAlias: MetricAlias,
): (undefined | { [alias: string]: any })[] {
  return eachAlias(Object.keys(settings || {}), metricAlias, (key) => {
    const value = Object.assign({}, settings[key])
    delete value.getPreTransformValue
    delete value.preTransform
    if (checkIsEmptyObject(value)) return
    return value
  })
}

export function getKey(metricKey: string, metricAlias: MetricAlias) {
  const alias = metricAlias[metricKey]
  return alias !== undefined ? alias : metricKey
}

export function shareCombinedMetrics(metrics: Metric[]) {
  return metrics
    .filter(({ expression }) => expression)
    .map(({ key, expression, label, baseMetrics, base }: CombinedMetric) => ({
      k: key,
      exp: expression,
      l: base?.label || label,
      bm: shareMetrics(baseMetrics),
    }))
}

export function getArrayValues(str: string): string[] {
  const array = [] as string[]

  let depth = 0
  let start = 0
  let cursor = 0

  let char
  while ((char = str[cursor])) {
    cursor++

    switch (char) {
      case '[':
        depth++
        continue

      case ']':
        depth--
        continue

      case ';':
        if (depth > 0) continue
        array.push(str.slice(start, cursor - 1))
        start = cursor
    }
  }

  array.push(str.slice(start))
  return array
}
