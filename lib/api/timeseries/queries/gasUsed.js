import { query } from 'san-webkit/lib/api';
import { newPrecacher } from './utils.js';
const GAS_USED_QUERY = `
  query gasUsed(
    $slug: String
    $from: DateTime!
    $to: DateTime!
    $interval: interval
  ) {
    gasUsed(slug: $slug, from: $from, to: $to, interval: $interval) {
      v: gasUsed
      d: datetime
    }
  }
`;
const precacher = newPrecacher(({ gasUsed }) => gasUsed);
export function queryGasUsed(variables, _, cachePolicy) {
    return query(GAS_USED_QUERY, {
        precacher,
        cachePolicy,
        variables,
    });
}
//# sourceMappingURL=gasUsed.js.map