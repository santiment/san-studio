import { query } from 'san-webkit/lib/api';
const QUERY = (metric, slug) => `{
  getMetric(metric:"${metric}") {
    availableSince(slug:"${slug}")
    lastDatetimeComputedAt(slug:"${slug}")
  }
}`;
const accessor = ({ getMetric }) => getMetric;
export const queryMetricInfo = (metric, slug) => query(QUERY(metric, slug)).then(accessor);
//# sourceMappingURL=api.js.map