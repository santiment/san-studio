import { query } from 'san-webkit/lib/api'
const HISTOGRAM_DATA_QUERY = (slug, from, to) => `
  query getMetric{
    hq:getMetric(metric: "price_histogram") {
      histogramData(slug:"${slug}", from:"${from}", to:"${to}", limit: 10) {
        values {
          ... on FloatRangeFloatValueList {
            data {
              r:range
              v:value
            }
          }
        }
      }
    }

    pq:getMetric(metric: "price_usd") {
      v:aggregatedTimeseriesData(
        slug:"${slug}"
        from:"${from}"
        to: "${to}"
        aggregation: LAST
      )
    }
  }
`
const bucketsMap = ({ r, v }) => ({ range: r, amount: v })
const precacher =
  () =>
  ({ hq, pq }) => {
    var _a
    return {
      buckets:
        ((_a = hq.histogramData.values.data) === null || _a === void 0
          ? void 0
          : _a.map(bucketsMap)) || [],
      price: pq.v,
    }
  }
const options = { precacher }
export const queryPriceHistogram = (slug, from, to) =>
  query(HISTOGRAM_DATA_QUERY(slug, from, to), options)
//# sourceMappingURL=histogram.js.map
