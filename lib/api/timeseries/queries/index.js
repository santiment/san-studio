import { query, HEADERS } from 'san-webkit/lib/api';
import { getMetricKeyMinInterval } from './../../../api/metrics/restrictions.js';
import { normalizeInterval } from './../../../utils/intervals.js';
export const GET_METRIC = `
  query getMetric(
    $metric: String!
    $from: DateTime!
    $to: DateTime!
    $slug: String
    $watchlistSlug: String
    $text: String
    $slugs: [String]
    $interval: interval
    $transform: TimeseriesMetricTransformInputObject
    $holdersCount: Int
    $market_segments: [String]
    $ignored_slugs: [String]
    $source: String
    $owner: String
    $label: String
    $labels: [String]
    $aggregation: Aggregation
    $label_fqn: String
    $address: String
    $nftAddress: String
    $includeIncompleteData: Boolean = true
  ) {
    getMetric(metric: $metric) {
      timeseriesData(
        selector: {
          slug: $slug
          address: $nftAddress
          contractAddress: $address
          watchlistSlug: $watchlistSlug
          text: $text
          slugs: $slugs
          labels: $labels
          holdersCount: $holdersCount
          market_segments: $market_segments
          ignored_slugs: $ignored_slugs
          source: $source
          owner: $owner
          label: $label
          labelFqn: $label_fqn
        }
        from: $from
        to: $to
        interval: $interval
        transform: $transform
        aggregation: $aggregation
        includeIncompleteData: $includeIncompleteData
      ) {
        d: datetime
        v: value
      }
    }
  }
`;
// TODO: defaultPrecacher using newPrecacher constructor [@vanguard | May 24, 2021]
const defaultPrecacher = ({ key }) => ({ getMetric: { timeseriesData } }) => {
    const data = new Array(timeseriesData.length);
    for (let i = timeseriesData.length - 1; i > -1; i--) {
        const { d, v } = timeseriesData[i];
        data[i] = {
            datetime: +new Date(d),
            [key]: v,
        };
    }
    return {
        getMetric: {
            timeseriesData: data,
        },
    };
};
export function queryMetric(variables, precacher = defaultPrecacher, cachePolicy, requestOptions) {
    return getMetricKeyMinInterval(variables.metric).then((minInterval) => {
        if (minInterval) {
            variables.interval = normalizeInterval(variables.interval || '', minInterval);
        }
        return query(GET_METRIC, {
            precacher,
            cachePolicy,
            variables,
        }, requestOptions);
    });
}
export function getSharedAccessHeaders(sharedAccessToken) {
    return sharedAccessToken
        ? Object.assign(Object.assign({}, HEADERS), { 'X-SharedAccess-Authorization': 'SharedAccessToken ' + sharedAccessToken }) : undefined;
}
//# sourceMappingURL=index.js.map