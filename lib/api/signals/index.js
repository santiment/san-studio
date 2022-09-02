import { query } from 'san-webkit/lib/api'
const SIGNAL_QUERY = `
  query getSignal(
    $signal: String
    $slug: String
    $from: DateTime!
    $to: DateTime!
    $interval: interval
  ) {
    getSignal(signal: $signal) {
      timeseriesData(slug: $slug, from: $from, to: $to, interval: $interval) {
        d: datetime
        v: value
      }
    }
  }
`
function signalTimeseriesPrecacher() {
  return ({ getSignal }) => {
    const rawData = getSignal.timeseriesData
    const data = new Array(rawData.length)
    for (let i = rawData.length - 1; i > -1; i--) {
      const { d, v } = rawData[i]
      data[i] = { datetime: +new Date(d), value: v }
    }
    return data
  }
}
export const querySignalTimeseries = (signal, { slug, from, to, interval }) =>
  query(SIGNAL_QUERY, {
    variables: { signal, slug, from, to, interval },
    precacher: signalTimeseriesPrecacher,
  })
const RAW_SIGNAL_QUERY = (slug, from, to) => `{
    getRawSignals(from:"${from}", to:"${to}", selector:{slug:"${slug}"}) {
        s: signal
    }
}`
function rawPrecacher() {
  return ({ getRawSignals }) => {
    const data = new Set()
    for (let i = getRawSignals.length - 1; i > -1; i--) {
      const { s } = getRawSignals[i]
      data.add(s)
    }
    return Array.from(data)
  }
}
export const queryRawSignal = (slug, from, to) =>
  query(RAW_SIGNAL_QUERY(slug, from, to), { precacher: rawPrecacher })
//# sourceMappingURL=index.js.map
