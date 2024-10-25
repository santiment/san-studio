import { query } from 'webkit/api'

export const queryAvailableVaults = () =>
  query<any>(`{
  getMetric(metric: "morpho_vaults_total_supplied_usd") {
    metadata {
      availableLabelFqns
    }
  }
}`).then((data) => data.getMetric.metadata.availableLabelFqns as string[])
