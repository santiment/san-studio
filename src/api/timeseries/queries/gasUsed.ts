import type { CachePolicy } from 'webkit/api/cache'
import type { Variables } from './utils'
import { query } from 'webkit/api'
import { newPrecacher } from './utils'

const GAS_USED_QUERY = `
  query gasUsed(
    $slug: String
    $from: DateTime
    $to: DateTime
    $interval: interval
  ) {
    gasUsed(slug: $slug, from: $from, to: $to, interval: $interval) {
      v: gasUsed
      d: datetime
    }
  }
`

const precacher = newPrecacher(({ gasUsed }) => gasUsed)
export function queryGasUsed(
  variables: Variables,
  _,
  cachePolicy?: CachePolicy,
): Promise<any> {
  return query(GAS_USED_QUERY, {
    precacher,
    cachePolicy,
    variables,
  })
}
