export declare function newDomainModifier(
  metrics: Studio.Metric[],
  MetricSettings: Studio.MetricSetting,
  widget: any,
): (metricKey: string, minMax: any) => any
export declare function groupDomains(
  metrics: Studio.Metric[],
  getDomain?: ({ domainGroup }: Studio.Metric) => string | undefined,
): string[][] | undefined
export declare function getIndicatorDomainGroup(metric: Studio.Metric): any
export declare function getIndicatorDomainGroups(
  metrics: Studio.Metric[],
  getDomain?: typeof getIndicatorDomainGroup,
): string[][] | undefined
export declare function checkHasDomainGroups(
  rawDomainGroups: undefined | string[][],
  alwaysDomainGroups?: string[][],
): boolean
