import { query } from 'san-webkit/lib/api';
export const queryLabelBasedMetricOwners = () => query(`{
  exchanges:getLabelBasedMetricOwners(metric: "exchange_open_interest")
}`).then((data) => data.exchanges);
//# sourceMappingURL=api.js.map