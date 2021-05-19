import { setContext, getContext } from 'svelte'
import { writable, get } from 'svelte/store'
import { Metric } from '@/metrics'
import { SelectorType } from '@/metrics/selector/types'

export type SelectedMetrics = {
  items: Studio.Metric[]
  subwidgets: any[]
  has: (metric: Studio.Metric) => boolean
}
export const selectedMetrics = (() => {
  const metricsSet = new Set<Studio.Metric>()
  const subwidgetsSet = new Set<any>()
  const store: SelectedMetrics = {
    items: [],
    subwidgets: [],
    has: (metric) => metricsSet.has(metric) || subwidgetsSet.has(metric),
  }
  const { subscribe, set } = writable<SelectedMetrics>(store)

  return {
    subscribe,
    clear() {
      metricsSet.clear()
      subwidgetsSet.clear()
      store.items = []
      store.subwidgets = []
      set(store)
    },
    toggle(metric: Studio.SelectorNode) {
      const isSubwidget = metric?.selectorType === SelectorType.Subwidget
      const target = isSubwidget ? subwidgetsSet : metricsSet

      if (target.has(metric)) {
        target.delete(metric)
      } else {
        target.add(metric)
      }

      if (isSubwidget) {
        store.subwidgets = Array.from(target)
      } else {
        store.items = Array.from(target)
      }
      set(store)
    },
  }
})()

export const selector = {
  toggle(node: Studio.SelectorNode): void {
    if (Metric[node.key]) {
      selectedMetrics.toggle(node as Studio.Metric)
    }
  },
  checkActive(
    node: Studio.SelectorNode,
    $selectedMetrics: SelectedMetrics,
  ): boolean {
    return $selectedMetrics.has(node as Studio.Metric)
  },
}

const NODE_CONTROLLER_CONTEXT = 'NodeController'
export const setNodeController = (NodeController): void =>
  setContext(NODE_CONTROLLER_CONTEXT, NodeController)
export const getNodeController = () => getContext(NODE_CONTROLLER_CONTEXT)
export function newNodeController(Widgets, Sidewidget) {
  function NodeController(node: Studio.SelectorNode) {
    if (node.selectorType === SelectorType.Sidewidget) {
      return Sidewidget.set(node === get(Sidewidget) ? null : node)
    }

    if (node.selectorType === SelectorType.Widget) {
      Widgets.new(node)
      return
    }

    if (node.selectorType === SelectorType.Subwidget) {
      selectedMetrics.toggle(node)
      return
    }

    selector.toggle(node)
  }

  setNodeController(NodeController)
  return NodeController
}

declare global {
  const $selectedMetrics: SelectedMetrics
}
