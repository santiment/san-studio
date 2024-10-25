import { query } from 'san-webkit/lib/api';
export const queryAvailableVaults = () => query(`{
  getMetric(metric: "morpho_vaults_total_supplied_usd") {
    metadata {
      availableLabelFqns
    }
  }
}`).then((data) => data.getMetric.metadata.availableLabelFqns);
//# sourceMappingURL=api.js.map