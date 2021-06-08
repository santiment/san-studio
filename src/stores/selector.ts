import { setContext, getContext } from 'svelte'
import { writable, get } from 'svelte/store'
import { Metric } from '@/metrics'
import { SelectorType } from '@/metrics/selector/types'

export type SelectedMetrics = {
  items: Studio.Metric[]
  subwidgets: any[]
  notables: any[]
  has: (item: Studio.Metric) => boolean
}
export const selectedMetrics = (() => {
  const metricsSet = new Set<Studio.Metric>()
  const subwidgetsSet = new Set<any>()
  const notablesSet = new Set<any>()
  const store: SelectedMetrics = {
    items: [],
    subwidgets: [],
    notables: [],
    has: (item) => metricsSet.has(item) || subwidgetsSet.has(item),
  }
  const { subscribe, set } = writable<SelectedMetrics>(store)

  function getTargets(selectorType: SelectorType) {
    switch (selectorType) {
      case SelectorType.Subwidget:
        return ['subwidgets', subwidgetsSet]
      case SelectorType.Notable:
        return ['notables', notablesSet]
      default:
        return ['items', metricsSet]
    }
  }

  return {
    subscribe,
    clear() {
      metricsSet.clear()
      subwidgetsSet.clear()
      notablesSet.clear()

      store.items = []
      store.subwidgets = []
      store.notables = []

      set(store)
    },
    toggle(item: Studio.SelectorNode) {
      if (item?.selectorType === SelectorType.Notable) {
        const { metric } = item as any
        if (notablesSet.has(metric)) {
          notablesSet.delete(metric)
          metricsSet.delete(metric)
        } else {
          notablesSet.add(metric)
          metricsSet.add(metric)
        }

        store.items = Array.from(metricsSet)
        store.notables = Array.from(notablesSet)
      } else {
        const [targetKey, target] = getTargets(item?.selectorType as any) as any

        if (target.has(item)) {
          target.delete(item)
          if (notablesSet.size) {
            notablesSet.delete(item)
            store.notables = Array.from(notablesSet)
          }
        } else {
          target.add(item)
        }

        store[targetKey] = Array.from(target)
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
  function NodeController(node: Studio.SelectorNode, e?: MouseEvent) {
    if (node.selectorType === SelectorType.Sidewidget) {
      return Sidewidget.set(node === get(Sidewidget) ? null : node)
    }

    if (node.selectorType === SelectorType.Widget) {
      Widgets.new(node)
      return
    }

    const isCtrl = e && (e.ctrlKey || e.metaKey)
    const widget = isCtrl && get<any>(Widgets)[0]

    if (node.selectorType === SelectorType.Subwidget) {
      if (widget) return Widgets.addSubwidgets(widget, [node])

      return selectedMetrics.toggle(node)
    }

    if (e && isCtrl && e.shiftKey) return Widgets.add([node])

    if (widget) return widget.Metrics.add(node)

    selector.toggle(node)
  }

  setNodeController(NodeController)
  return NodeController
}

declare global {
  const $selectedMetrics: SelectedMetrics
}
