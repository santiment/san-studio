import { query } from 'webkit/api'

const PRICE_OHLC_QUERY = `
  query ohlc(
    $slug: String
    $from: DateTime
    $to: DateTime
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
  slug: string
  from: string
  to: string
  interval: string
}

const precacher =
  ({ key }: Variables) =>
  ({ ohlc }) => {
    const data = new Array(ohlc.length)

    for (let i = ohlc.length - 1; i > -1; i--) {
      const { d, o, h, l, c } = ohlc[i]
      data[i] = {
        datetime: +new Date(d),
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
  return query<any>(PRICE_OHLC_QUERY, {
    precacher,
    cacheTime: 600,
    variables,
  }).then(accessor)
}
