const checkIsEmptyObject = (obj) => Object.keys(obj).length === 0
export function newURLQuery(obj) {
  let searchString = ''
  for (let key in obj) {
    const value = obj[key]
    if (value === undefined || value.length === 0) continue
    if (value === '[]' || value === '{}') continue
    const encodedValue = encodeURIComponent(Array.isArray(value) ? value.join(';') : value)
    if (encodedValue === '') continue
    searchString += `&${encodeURIComponent(key)}=${encodedValue}`
  }
  return searchString.slice(1)
}
const keyAccessor = ({ key }) => key
export const shareMetrics = (metrics) => metrics.map(keyAccessor)
export function newMetricAlias(metricKeys) {
  const metricAlias = {}
  for (let i = metricKeys.length - 1; i > -1; i--) {
    metricAlias[metricKeys[i]] = i
  }
  return metricAlias
}
export function eachAlias(keys, metricAlias, clb) {
  const { length } = keys
  const result = new Array(length)
  for (let i = 0; i < length; i++) {
    const key = keys[i]
    result[metricAlias[key]] = clb(key)
  }
  return result
}
export const shareAxesMetrics = (axesMetrics, accessor = keyAccessor) =>
  Array.from(axesMetrics || []).map(accessor)
export const shareColors = (colors, metricAlias) =>
  eachAlias(Object.keys(colors || {}), metricAlias, (key) => colors[key])
export function shareMetricSettings(settings, metricAlias) {
  return eachAlias(Object.keys(settings || {}), metricAlias, (key) => {
    const value = Object.assign({}, settings[key])
    delete value.getPreTransformValue
    delete value.preTransform
    if (checkIsEmptyObject(value)) return
    return value
  })
}
export function getKey(metricKey, metricAlias) {
  const alias = metricAlias[metricKey]
  return alias !== undefined ? alias : metricKey
}
export function shareCombinedMetrics(metrics) {
  return metrics
    .filter(({ expression }) => expression)
    .map(({ key, expression, label, baseMetrics, base }) => ({
      k: key,
      exp: expression,
      l: (base === null || base === void 0 ? void 0 : base.label) || label,
      bm: shareMetrics(baseMetrics),
    }))
}
export function getArrayValues(str) {
  const array = []
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
//# sourceMappingURL=index.js.map
