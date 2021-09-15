import type { Query } from 'webkit/api'
import { query } from 'webkit/api'

const HISTOGRAM_DATA_QUERY = (slug: string, from: string, to: string) => `
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
  ({ hq, pq }) => ({
    buckets: hq.histogramData.values.data.map(bucketsMap),
    price: pq.v,
  })

const options = { precacher }

export const queryPriceHistogram = (
  slug: string,
  from: string,
  to: string,
): Promise<string[]> =>
  query<any>(HISTOGRAM_DATA_QUERY(slug, from, to), options) as any
