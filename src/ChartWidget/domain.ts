import { prepareDomain } from 'san-chart/bars/greenRedBars'
import { Metric } from '@/metrics'
import { Node } from '@/Chart/nodes'

const DEFAULT_DOMAIN_METRIC = new Set([
  Metric.twitter_followers.key,
  // Metric.miners_balance.key,
])

export function newDomainModifier(
  metrics: Studio.Metric[],
  MetricSettings: Studio.MetricSetting,
) {
  const MetricNode = {}
  metrics.forEach(({ key, node }) => {
    MetricNode[key] = MetricSettings[key]?.node || node
  })

  return (metricKey: string, minMax) => {
    if (DEFAULT_DOMAIN_METRIC.has(metricKey)) return
    const node = MetricNode[metricKey]
    let { min, max } = minMax

    if (node === Node.GREEN_RED_BAR) {
      return prepareDomain(minMax)
    } else if (node === Node.BAR) {
      max *= 1.01
      min = min < 0 ? min : 0
    } else {
      max *= 1.01
      min *= min > 0 ? 0.99 : 1.01
    }

    minMax.max = max
    minMax.min = min
  }
}

const getMetricDomain = ({ domainGroup }: Studio.Metric) => domainGroup
export function groupDomains(
  metrics: Studio.Metric[],
  getDomain = getMetricDomain,
) {
  const Domain = {} as { [metricKey: string]: string[] }

  const { length } = metrics
  for (let i = 0; i < length; i++) {
    const metric = metrics[i]
    const { key } = metric
    const domainGroup = getDomain(metric) || metric.domainGroup
    if (!domainGroup) continue

    if (Domain[domainGroup]) {
      Domain[domainGroup].push(key)
    } else {
      Domain[domainGroup] = metrics.includes(Metric[domainGroup])
        ? [domainGroup, key]
        : [key]
    }
  }

  const domainGroups = Object.values(Domain)
  return domainGroups.length > 0 ? domainGroups : undefined
}

function getIndicatorDomainGroup(metric: Studio.Metric) {
  const { key, indicator, base, project, domainGroup } = metric
  return indicator ? base.key : project ? key : domainGroup
}
export function getIndicatorDomainGroups(metrics: Studio.Metric[]) {
  return groupDomains(metrics, getIndicatorDomainGroup)
}

export function checkHasDomainGroups(
  rawDomainGroups: undefined | string[][],
  alwaysDomainGroups: string[][] = [],
) {
  if (!rawDomainGroups) return false

  const RootDomainSet = {} as { [metricKey: string]: Set<string> }
  for (let i = 0, len = rawDomainGroups.length; i < len; i++) {
    const group = rawDomainGroups[i]
    RootDomainSet[group[0]] = new Set(group.slice(1))
  }

  for (let i = 0, len = alwaysDomainGroups.length; i < len; i++) {
    const group = alwaysDomainGroups[i]
    const domainSet = RootDomainSet[group[0]]
    if (!domainSet) continue

    for (let y = 1, len = group.length; y < len; y++) {
      domainSet.delete(group[y])
    }

    if (domainSet.size > 0) return true
  }

  const domains = Object.values(RootDomainSet)
  for (let i = 0, len = domains.length; i < len; i++) {
    if (domains[i].size) return true
  }

  return false
}
