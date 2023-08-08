import { query } from 'webkit/api'

export const queryLabelBasedMetricOwners = () =>
  query<any>(`{
  exchanges:getLabelBasedMetricOwners(metric: "exchange_open_interest")
}`).then((data) => data.exchanges as string[])
