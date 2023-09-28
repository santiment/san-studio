import { query } from 'webkit/api'
import { GET_METRIC } from './queries'

const PRICE_OHLC_QUERY = `
  query ohlc(
    $slug: String!
    $from: DateTime!
    $to: DateTime!
    $interval: interval
  ) {
    ohlc(from: $from, to: $to, interval: $interval, slug: $slug) {
      d: datetime
      o: openPriceUsd
      h: highPriceUsd
      l: lowPriceUsd
      c: closePriceUsd
    }
  }
`

type Variables = {
  key: string
  slug: string
  from: string
  to: string
  interval: string
}

const precacher =
  ({ key }: Variables) =>
  ({ getMetric }) => {
    const ohlc = getMetric.timeseriesData
    const data = new Array(ohlc.length)

    for (let i = ohlc.length - 1; i > -1; i--) {
      const { d, v } = ohlc[i]
      const { o, h, l, c } = v
      data[i] = {
        datetime: Date.parse(d),
        [key as any]: {
          open: o,
          high: h,
          low: l,
          close: c,
        },
      }
    }

    return {
      ohlc: data,
    }
  }

const accessor = ({ ohlc }) => ohlc
export function queryOHLC(variables: Variables): Promise<any> {
  return query<any>(
    GET_METRIC.replace(
      'v: value',
      `v: valueOhlc{
        o:open
        h:high
        c:close
        l:low
      }`,
    ),
    {
      precacher,
      cacheTime: 600,
      variables: { ...variables, aggregation: 'OHLC' },
    },
  ).then(accessor)
}
