import type { SelectorGraph } from './graph'
import { MetricIndex } from './index'
import { SelectorNode } from './selector'
import { Subitems, IsSubitem } from './selector/subitems'
import { ReplacementNode } from './selector/replacements'
import { MetricCategory } from './graph'

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

const indexSorter = (a: string, b: string) =>
  (MetricIndex[a] || -1) - (MetricIndex[b] || -1)
export function getMetricsSelectorGraph(
  metricKeys: string[],
  options: { [key: string]: string },
): SelectorGraph {
  const graph: SelectorGraph = {
    [MetricCategory.Financial]: [],
    [MetricCategory.Development]: [],
    [MetricCategory.Social]: [],
    [MetricCategory.OnChain]: [],
  }

  const { length } = metricKeys.sort(indexSorter)
  for (let i = 0; i < length; i++) {
    const metricKey = metricKeys[i]
    const node = (ReplacementNode[metricKey] || SelectorNode[metricKey]) as
      | undefined
      | Studio.SelectorNode

    if (node === undefined || IsSubitem[metricKey]) continue
    if (node.checkIsVisible && !node.checkIsVisible(options)) continue

    const categoryItems = graph[node.category]
    categoryItems.push(node)

    const subitems = Subitems[metricKey]
    if (subitems) categoryItems.push(...subitems)
  }

  return graph
}

export const checkIsFilterMatch = (searchTerm: string, { label, shorthand }) =>
  label.toLowerCase().includes(searchTerm) ||
  (shorthand && shorthand.includes(searchTerm))

export function filterSelectorGraph(graph: SelectorGraph, searchTerm: string) {
  const filtered = {}
  Object.keys(graph).forEach((category) => {
    const items = graph[category]
    const filteredItems = graph[category].slice()
    const IsRootPlaced = {}

    let j = 0
    const { length } = items
    for (let i = 0; i < length; i++) {
      const item = items[i]
      const { key, label, submetricOf } = item

      if (checkIsFilterMatch(searchTerm, item)) {
        if (submetricOf && IsRootPlaced[submetricOf.key] === undefined) {
          filteredItems[j++] = submetricOf
          IsRootPlaced[submetricOf.key] = true
        }

        IsRootPlaced[key] = true
        filteredItems[j++] = item
      }
    }

    filteredItems.length = j
    filtered[category] = filteredItems
  })
  return filtered
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

export function newProjectMetric(project: Project, baseMetric: Studio.Metric) {
  const { ticker, slug } = project
  return deriveMetric(baseMetric, {
    key: buildProjectMetricKey(project, baseMetric),
    project,
    base: baseMetric,
    label: `${baseMetric.label} (${ticker})`,
    reqMeta: {
      slug,
    },
  } as any)
}
