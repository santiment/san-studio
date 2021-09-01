import type { CachePolicy } from 'webkit/api/cache'
import type { Variables } from './utils'
import { query } from 'webkit/api'
import { newPrecacher } from './utils'

export const TOP_HOLDERS_PERCENT_OF_TOTAL_SUPPLY = `
  query topHoldersPercentOfTotalSupply(
    $slug: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    topHoldersPercentOfTotalSupply(
      slug: $slug
      numberOfHolders: 10
      from: $from
      to: $to
    ) {
      d: datetime
      v: inTopHoldersTotal
    }
  }
`

const precacher = newPrecacher(
  ({ topHoldersPercentOfTotalSupply }) => topHoldersPercentOfTotalSupply,
)
export function queryTopHoldersPercentOfTatalSupply(
  variables: Variables,
  _,
  cachePolicy?: CachePolicy,
): Promise<any> {
  return query(TOP_HOLDERS_PERCENT_OF_TOTAL_SUPPLY, {
    precacher,
    cachePolicy,
    variables,
  })
}
