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

type HistogramQuery = {
  hq: {
    histogramData: {
      values: {
        data?: { r: [number, number]; v: number }[]
      }
    }
  }

  pq: {
    v: number
  }
}

type Histogram = {
  buckets: { range: [number, number]; amount: number }[]
  price: number
}

const bucketsMap = ({ r, v }) => ({ range: r, amount: v })
const precacher =
  () =>
  ({ hq, pq }: HistogramQuery): Histogram => ({
    buckets: hq.histogramData.values.data?.map(bucketsMap) || [],
    price: pq.v,
  })

const options = { precacher }
export const queryPriceHistogram = (slug: string, from: string, to: string): Promise<Histogram[]> =>
  query<any>(HISTOGRAM_DATA_QUERY(slug, from, to), options)
