// NOTE: Don't change ids! This will break parsing of shared links
export enum MetricType {
  Basic = 0,
  ProjectLocked = 1,
  Indicator = 2,
  MergedSupplyDistribution = 3,
  // Combined = 4,
}

export type Node<T, K> = T & {
  key: K
}

type Nodes = { [key: string]: { [key: string]: any } }

type NodesMap<T extends Nodes, U = Studio.Metric> = {
  [K in keyof T]: Node<U, K>
}

export const newKey = (...data) => '[' + data.join(';') + ']'

export function each<T extends Nodes, U>(
  nodes: T,
  clb: (node: U, key: string, i: number) => void | any,
): NodesMap<T, U> {
  const keys = Object.keys(nodes)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    clb(nodes[key] as U, key, i)
  }

  return nodes as unknown as NodesMap<T, U>
}

export function deriveMetric(baseMetric: Studio.Metric, newMetric: Studio.Metric) {
  const { key, queryKey = key, domainGroup = key } = baseMetric
  const { reqMeta } = newMetric

  newMetric.domainGroup = domainGroup
  newMetric.queryKey = queryKey

  if (reqMeta) {
    newMetric.reqMeta = Object.assign({}, baseMetric.reqMeta, reqMeta)
  }

  return Object.assign({}, baseMetric, newMetric)
}

type Project = {
  slug: string
  ticker: string
}

export function newProjectMetricKey(project: Project, metric: Studio.Metric): string {
  const { slug, ticker } = project
  return newKey(MetricType.ProjectLocked, metric.key, slug, ticker)
}

const ProjectMetricCache = {}
export function newProjectMetric(project: Project, baseMetric: Studio.Metric) {
  const { ticker, slug } = project
  const key = newProjectMetricKey(project, baseMetric)

  const cached = ProjectMetricCache[key]
  if (cached) return cached

  // TODO: Refactor [@vanguard | Jun  9, 2021]
  const isWatchlist = slug === 'stablecoins'
  const selector = isWatchlist ? 'watchlistSlug' : 'slug'
  const metric = deriveMetric(baseMetric, {
    key,
    project,
    base: baseMetric,
    label: `${baseMetric.label} (${ticker})`,
    reqMeta: {
      [selector]: slug,
    },
  } as any)

  if (isWatchlist) metric.selector = selector

  ProjectMetricCache[key] = metric
  return metric
}
