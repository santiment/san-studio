import type { CachePolicy } from 'webkit/api/cache'
import type { Variables } from './utils'
import { query } from 'webkit/api'
import { newPrecacher } from './utils'

const ETH_SPENT_OVER_TIME_QUERY = `
  query ethSpentOverTime(
    $slug: String
    $from: DateTime
    $to: DateTime
    $interval: interval
  ) {
    projectBySlug(slug: $slug) {
      ethSpentOverTime(from: $from, to: $to, interval: $interval) {
        d: datetime
        v: ethSpent
      }
    }
  }
`

const precacher = newPrecacher(
  ({ projectBySlug }) => projectBySlug.ethSpentOverTime,
)
export function queryEthSpentOverTime(
  variables: Variables,
  _,
  cachePolicy?: CachePolicy,
): Promise<any> {
  return query(ETH_SPENT_OVER_TIME_QUERY, {
    precacher,
    cachePolicy,
    variables,
  })
}
