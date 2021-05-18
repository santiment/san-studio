import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
import { SelectorNode } from '@/metrics/selector'
import ChartWidget from '@/ChartWidget/index.svelte'
import HolderDistributionWidget from '@/HolderDistributionWidget/index.svelte'

let id = 0
export function newWidget(Widget: any, props?: any) {
  return Object.assign(
    {
      Widget,
      id: id++,
      subwidgets: [],
    },
    props,
  )
}

const WIDGETS_CONTEXT = 'widgets'
export const setWidgets = (widgets): void =>
  setContext(WIDGETS_CONTEXT, widgets)
export const getWidgets = () => getContext(WIDGETS_CONTEXT)
export function initWidgets(defaultWidgets) {
  const widgets = defaultWidgets.slice()
  const { update, subscribe, set } = writable(widgets)

  const store = {
    subscribe,
    add(widget, metrics: Studio.Metric[]) {
      widgets.push(
        newWidget(ChartWidget, {
          metrics,
        }),
      )
      set(widgets)
    },
    delete(widget, i: number) {
      widgets.splice(i, 1)
      set(widgets)
    },
    new(node: Studio.SelectorNode) {
      let widget
      if (node === SelectorNode.addresses_number_distribution) {
        widget = newWidget(HolderDistributionWidget)
      }

      widgets.push(widget)
      set(widgets)
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
  const { subscribe, set } = writable(defaultValue)

  const store = {
    subscribe,
    set,
  }
  setSidewidget(store)
  return store
}
