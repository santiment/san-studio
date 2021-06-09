export type Node<T, K> = T & {
  key: K
}

type Nodes = { [key: string]: { [key: string]: any } }

type NodesMap<T extends Nodes, U = Studio.Metric> = {
  [K in keyof T]: Node<U, K>
}

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

export function deriveMetric(
  baseMetric: Studio.Metric,
  newMetric: Studio.Metric,
) {
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
export const METRIC_CONNECTOR = '_MC_'
export function buildProjectMetricKey(project: Project, metric: Studio.Metric) {
  const { slug, ticker } = project
  return `${slug}${METRIC_CONNECTOR}${ticker}${METRIC_CONNECTOR}${metric.key}`
}

const ProjectMetricCache = {}
export function newProjectMetric(project: Project, baseMetric: Studio.Metric) {
  const { ticker, slug } = project
  const key = buildProjectMetricKey(project, baseMetric)

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
