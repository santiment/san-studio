import { query } from 'san-webkit/lib/api'
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
const precacher =
  ({ key }) =>
  ({ ohlc }) => {
    const data = new Array(ohlc.length)
    for (let i = ohlc.length - 1; i > -1; i--) {
      const { d, o, h, l, c } = ohlc[i]
      data[i] = {
        datetime: +new Date(d),
        [key]: {
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
export function queryOHLC(variables) {
  return query(PRICE_OHLC_QUERY, {
    precacher,
    cacheTime: 600,
    variables,
  }).then(accessor)
}
//# sourceMappingURL=ohlc.js.map
