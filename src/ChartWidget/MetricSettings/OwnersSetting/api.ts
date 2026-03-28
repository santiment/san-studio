import { query } from 'webkit/api'

export const queryAvailableOwners = (metric: string, slug: string) =>
  query<any>(`{
  getLabelBasedMetricOwners(
    metric: "${metric}"
    slug: "${slug}"
  )
}`).then((data) => data.getLabelBasedMetricOwners as string[])

export const queryAvailableOwnerLabels = (metric: string, slug: string, owner: string) =>
  query<any>(`{
  getLabelBasedMetricLabels(
    metric: "${metric}"
    slug: "${slug}"
    owner: "${owner}"
  )
}`).then((data) => data.getLabelBasedMetricLabels as string[])
