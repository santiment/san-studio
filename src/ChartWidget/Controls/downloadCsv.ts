import { getTimeFormats, getDateFormats } from 'webkit/utils/dates'

function normalizeHeader(label: string) {
  return label.includes(',') ? `"${label}"` : label
}

export function downloadCsv(widget, { slug, name = slug, ticker }) {
  const { chart, Metrics, MetricSettings } = widget
  const { data } = chart

  const metrics = Metrics.getValue()
  const headers = [{ label: 'Date', key: 'datetime' }]
  metrics.forEach(({ label, key }) =>
    headers.push({ key, label: normalizeHeader(label) }),
  )
  const headersLength = headers.length

  const { length } = data
  const rows = new Array(length + 1)

  rows[0] = headers.map(({ label }) => label)
  for (let i = 0; i < length; i++) {
    const metricData = data[i]
    const row = new Array(headersLength)
    rows[i + 1] = row

    row[0] = new Date(metricData.datetime).toISOString()
    for (let y = 1; y < headersLength; y++) {
      const { key } = headers[y]
      const { getPreTransformValue } = MetricSettings.getMetricSettings(key)
      const value = metricData[key]
      row[y] =
        value && getPreTransformValue ? getPreTransformValue(value) : value
    }
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
  const date = new Date()
  const { DD, MMM, YYYY } = getDateFormats(date)
  const { HH, mm, ss } = getTimeFormats(date)
  const title = `${name} (${ticker})`

  const a = document.createElement('a')
  a.download = `${title} [${HH}.${mm}.${ss}, ${DD} ${MMM}, ${YYYY}].csv`
  a.href = encodeURI(csvContent)
  a.click()
  a.remove()
}
