import { writable } from 'svelte/store'
import { track } from 'webkit/analytics'
import { Event } from '@/analytics'
import { getStudioContext, setStudioContext } from '@/context'
import { SelectorNode } from '@/metrics/selector'
import ChartWidget from '@/ChartWidget/index.svelte'
import HolderDistributionWidget from '@/HolderDistributionWidget/index.svelte'
import HolderDistributionBalanceWidget from '@/HolderDistributionWidget/Balance.svelte'
import HolderDistributionLabeledWidget from '@/HolderDistributionWidget/Labeled.svelte'
import PriceDAAWidget from '@/PriceDAAWidget/index.svelte'
import AdjustedPriceDAAWidget from '@/PriceDAAWidget/Adjusted.svelte'

let id = 0
export function newWidget(Widget: any, props?: any) {
  return Object.assign(
    {
      Widget,
      id: id++,
      isExternal: false,
      subwidgets: [],
    },
    props,
  )
}

const WIDGETS_CONTEXT = 'widgets'
export const setWidgets = (widgets): void => setStudioContext(WIDGETS_CONTEXT, widgets)
export const getWidgets = (): any => getStudioContext(WIDGETS_CONTEXT)
export function initWidgets(defaultWidgets, getExternalWidget, History) {
  let widgets = defaultWidgets.slice()
  const { subscribe, set } = writable(widgets)

  const store = {
    subscribe,
    get() {
      return widgets
    },
    set(newWidgets) {
      set((widgets = newWidgets))
    },
    add(metrics: Studio.Metric[], signalMetrics: Studio.Metric[], addToStart = false) {
      const widget = newWidget(ChartWidget, {
        metrics,
        signalMetrics,
        scrollOnMount: true,
      })

      if (addToStart) {
        widgets.unshift(widget)
      } else {
        widgets.push(widget)
      }

      set(widgets)
      track.event(Event.NewWidget, { widget: 'chart' })
      return widget
    },
    unshift(widget) {
      const widgetsSet = new Set(widgets)
      widgetsSet.delete(widget)
      set((widgets = [widget, ...widgetsSet]))
    },
    push(widget) {
      const widgetsSet = new Set(widgets)
      widgetsSet.add(widget)
      set((widgets = Array.from(widgetsSet)))
    },
    delete(widget) {
      const widgetsSet = new Set(widgets)
      widgetsSet.delete(widget)
      set((widgets = Array.from(widgetsSet)))
    },
    new(node: Studio.SelectorNode) {
      let widget
      if (node === SelectorNode.addresses_number_distribution) {
        widget = newWidget(HolderDistributionWidget)
      } else if (node === SelectorNode.addresses_balance_distribution) {
        widget = newWidget(HolderDistributionBalanceWidget)
      } else if (node === SelectorNode.labeled_addresses_number_distribution) {
        widget = newWidget(HolderDistributionLabeledWidget)
      } else if (node === SelectorNode.price_daa_divergence) {
        widget = newWidget(PriceDAAWidget)
      } else if (node === SelectorNode.adjusted_price_daa_divergence) {
        widget = newWidget(AdjustedPriceDAAWidget)
      } else {
        widget = getExternalWidget?.(node)
      }

      if (!widget) return

      function redo() {
        widget.scrollOnMount = true
        widgets.push(widget)
        set(widgets)
      }
      redo()

      History.add('New widget', () => widget?.delete(), redo)

      track.event(Event.NewWidget, { widget: node.key })
    },
    addSubwidgets(widget: any, subwidgets: any[]) {
      const subwidgetsSet = new Set(widget.subwidgets.concat(subwidgets))
      widget.subwidgets = Array.from(subwidgetsSet)
      set(widgets)
    },
  }
  setWidgets(store)
  return store
}

export const SidewidgetType = {
  LAYOUT_COMMENTS: 'LAYOUT_COMMENTS',
  EXPLAIN_METRICS: 'METRICS_EXPLANATION_PANE',
} as const

const SIDEWIDGET_CONTEXT = 'sidewidget'
export const setSidewidget = (sidewidget): void => setStudioContext(SIDEWIDGET_CONTEXT, sidewidget)
export const getSidewidget = () => getStudioContext(SIDEWIDGET_CONTEXT)
export function initSidewidget(defaultValue) {
  let sidewidget = defaultValue
  const { subscribe, set } = writable(defaultValue)

  const store = {
    subscribe,
    set(value) {
      sidewidget = sidewidget === value ? undefined : value
      set(sidewidget)
      // prettier-ignore
      if (sidewidget) track.event(Event.Sidewidget, { sidewidget: value.key || value })
    },
  }
  setSidewidget(store)
  return store
}
