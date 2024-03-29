import type { SelectorGraph } from '@/metrics/graph'
import { MetricCategory } from '@/metrics/graph'
import { SelectorNode } from './index'
import { Subitems, IsSubitem } from './subitems'
import { ReplacementNode } from './replacements'

function addItemToSelectorGraph(
  graph: SelectorGraph,
  node,
  metricKey: string,
  filter: (item: any) => boolean,
) {
  if (!filter(node)) return

  const categoryItems = graph[node.category]
  categoryItems.push(node)

  const subitems = Subitems[metricKey]
  if (subitems) categoryItems.push(...subitems.filter(filter))
}

export function getMetricsSelectorGraph(
  metricKeys: string[],
  options: { [key: string]: string },
): SelectorGraph {
  const graph: SelectorGraph = {
    [MetricCategory.Financial]: [],
    [MetricCategory.Social]: [],
    [MetricCategory.Development]: [],
    [MetricCategory.Derivatives]: [],
    [MetricCategory.Indicators]: [],
    [MetricCategory.OnChain]: [],
    [MetricCategory.OnChainLabels]: [],
  }

  const filter = ({ checkIsVisible }: any) => (checkIsVisible ? checkIsVisible(options) : true)
  const { length } = metricKeys
  for (let i = 0; i < length; i++) {
    const metricKey = metricKeys[i]
    const node = (ReplacementNode[metricKey] || SelectorNode[metricKey]) as
      | undefined
      | Studio.SelectorNode
      | Studio.SelectorNode[]

    if (node === undefined || IsSubitem[metricKey]) continue
    if (Array.isArray(node)) {
      for (let i = 0, len = node.length; i < len; i++) {
        addItemToSelectorGraph(graph, node[i], metricKey, filter)
      }
    } else {
      addItemToSelectorGraph(graph, node, metricKey, filter)
    }
  }

  return graph
}

export const checkIsFilterMatch = (
  searchTerm: string,
  { label, title, group, shorthand }: Studio.Metric & { title: string },
) =>
  (label || title).toLowerCase().includes(searchTerm) ||
  (group && group.toLowerCase().includes(searchTerm)) ||
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
      const { key, submetricOf } = item

      const predicate = (word: string) => checkIsFilterMatch(word, item)
      if (searchTerm.split(' ').every(predicate)) {
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
