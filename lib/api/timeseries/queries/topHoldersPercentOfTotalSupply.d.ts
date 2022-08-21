import type { CachePolicy } from 'san-webkit/lib/api/cache';
import type { Variables } from './utils';
export declare const TOP_HOLDERS_PERCENT_OF_TOTAL_SUPPLY = "\n  query topHoldersPercentOfTotalSupply(\n    $slug: String!\n    $from: DateTime!\n    $to: DateTime!\n  ) {\n    topHoldersPercentOfTotalSupply(\n      slug: $slug\n      numberOfHolders: 10\n      from: $from\n      to: $to\n    ) {\n      d: datetime\n      v: inTopHoldersTotal\n    }\n  }\n";
export declare function queryTopHoldersPercentOfTatalSupply(variables: Variables, _: any, cachePolicy?: CachePolicy): Promise<any>;
