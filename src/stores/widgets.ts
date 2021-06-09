import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
import { track } from 'webkit/analytics'
import { Event } from '@/analytics'
import { SelectorNode } from '@/metrics/selector'
import ChartWidget from '@/ChartWidget/index.svelte'
import HolderDistributionWidget from '@/HolderDistributionWidget/index.svelte'
import HolderDistributionBalanceWidget from '@/HolderDistributionWidget/Balance.svelte'
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
export const setWidgets = (widgets): void =>
  setContext(WIDGETS_CONTEXT, widgets)
export const getWidgets = (): any => getContext(WIDGETS_CONTEXT)
export function initWidgets(defaultWidgets, getExternalWidget) {
  let widgets = defaultWidgets.slice()
  const { update, subscribe, set } = writable(widgets)

  const store = {
    subscribe,
    set(newWidgets) {
      set((widgets = newWidgets))
    },
    add(metrics: Studio.Metric[], signalMetrics: Studio.Metric[]) {
      widgets.push(
        newWidget(ChartWidget, {
          metrics,
          signalMetrics,
          scrollOnMount: true,
        }),
      )
      set(widgets)
      track.event(Event.NewWidget, { widget: 'chart' })
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
      } else if (node === SelectorNode.price_daa_divergence) {
        widget = newWidget(PriceDAAWidget)
      } else if (node === SelectorNode.adjusted_price_daa_divergence) {
        widget = newWidget(AdjustedPriceDAAWidget)
      } else {
        widget = getExternalWidget?.(node)
      }

      if (!widget) return
      widget.scrollOnMount = true
      widgets.push(widget)

      set(widgets)
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

const SIDEWIDGET_CONTEXT = 'sidewidget'
export const setSidewidget = (sidewidget): void =>
  setContext(SIDEWIDGET_CONTEXT, sidewidget)
export const getSidewidget = () => getContext(SIDEWIDGET_CONTEXT)
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
