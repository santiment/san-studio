import { query } from 'san-webkit/lib/api';
export const queryAvailableOwners = (metric, slug) => query(`{
  getLabelBasedMetricOwners(
    metric: "${metric}"
    slug: "${slug}"
  )
}`).then((data) => data.getLabelBasedMetricOwners);
export const queryAvailableOwnerLabels = (metric, slug, owner) => query(`{
  getLabelBasedMetricLabels(
    metric: "${metric}"
    slug: "${slug}"
    owner: "${owner}"
  )
}`).then((data) => data.getLabelBasedMetricLabels);
//# sourceMappingURL=api.js.map