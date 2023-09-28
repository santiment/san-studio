import { query } from 'san-webkit/lib/api';
import { GET_METRIC } from './queries/index.js';
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
`;
const precacher = ({ key }) => ({ getMetric }) => {
    const ohlc = getMetric.timeseriesData;
    const data = new Array(ohlc.length);
    for (let i = ohlc.length - 1; i > -1; i--) {
        const { d, v } = ohlc[i];
        const { o, h, l, c } = v;
        data[i] = {
            datetime: Date.parse(d),
            [key]: {
                open: o,
                high: h,
                low: l,
                close: c,
            },
        };
    }
    return {
        ohlc: data,
    };
};
const accessor = ({ ohlc }) => ohlc;
export function queryOHLC(variables) {
    return query(GET_METRIC.replace('v: value', `v: valueOhlc{
        o:open
        h:high
        c:close
        l:low
      }`), {
        precacher,
        cacheTime: 600,
        variables: Object.assign(Object.assign({}, variables), { aggregation: 'OHLC' }),
    }).then(accessor);
}
//# sourceMappingURL=ohlc.js.map