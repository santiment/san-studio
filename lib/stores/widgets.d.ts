import { SelectorNode } from './../../lib/metrics/selector'
export declare function newWidget(Widget: any, props?: any): any
export declare const setWidgets: (widgets: any) => void
export declare const getWidgets: () => any
export declare function initWidgets(
  defaultWidgets: any,
  getExternalWidget: any,
  History: any,
): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: ((value?: any) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  get(): any
  set(newWidgets: any): void
  add(metrics: Studio.Metric[], signalMetrics: Studio.Metric[], addToStart?: boolean): any
  unshift(widget: any): void
  push(widget: any): void
  delete(widget: any): void
  new (node: Studio.SelectorNode): void
  addSubwidgets(widget: any, subwidgets: any[]): void
}
export declare const SidewidgetType: {
  readonly LAYOUT_COMMENTS: 'LAYOUT_COMMENTS'
  readonly EXPLAIN_METRICS: 'METRICS_EXPLANATION_PANE'
}
export declare const setSidewidget: (sidewidget: any) => void
export declare const getSidewidget: () => unknown
export declare function initSidewidget(defaultValue: any): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: ((value?: any) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set(value: any): void
}
