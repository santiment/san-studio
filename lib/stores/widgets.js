import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { Event } from './../../lib/analytics';
import { SelectorNode } from './../../lib/metrics/selector';
import ChartWidget from './../../lib/ChartWidget/index.svelte';
import HolderDistributionWidget from './../../lib/HolderDistributionWidget/index.svelte';
import HolderDistributionBalanceWidget from './../../lib/HolderDistributionWidget/Balance.svelte';
import HolderDistributionLabeledWidget from './../../lib/HolderDistributionWidget/Labeled.svelte';
import PriceDAAWidget from './../../lib/PriceDAAWidget/index.svelte';
import AdjustedPriceDAAWidget from './../../lib/PriceDAAWidget/Adjusted.svelte';
let id = 0;
export function newWidget(Widget, props) {
    return Object.assign({
        Widget,
        id: id++,
        isExternal: false,
        subwidgets: [],
    }, props);
}
const WIDGETS_CONTEXT = 'widgets';
export const setWidgets = (widgets) => setContext(WIDGETS_CONTEXT, widgets);
export const getWidgets = () => getContext(WIDGETS_CONTEXT);
export function initWidgets(defaultWidgets, getExternalWidget, History) {
    let widgets = defaultWidgets.slice();
    const { subscribe, set } = writable(widgets);
    const store = {
        subscribe,
        get() {
            return widgets;
        },
        set(newWidgets) {
            set((widgets = newWidgets));
        },
        add(metrics, signalMetrics, addToStart = false) {
            const widget = newWidget(ChartWidget, {
                metrics,
                signalMetrics,
                scrollOnMount: true,
            });
            if (addToStart) {
                widgets.unshift(widget);
            }
            else {
                widgets.push(widget);
            }
            set(widgets);
            track.event(Event.NewWidget, { widget: 'chart' });
            return widget;
        },
        unshift(widget) {
            const widgetsSet = new Set(widgets);
            widgetsSet.delete(widget);
            set((widgets = [widget, ...widgetsSet]));
        },
        push(widget) {
            const widgetsSet = new Set(widgets);
            widgetsSet.add(widget);
            set((widgets = Array.from(widgetsSet)));
        },
        delete(widget) {
            const widgetsSet = new Set(widgets);
            widgetsSet.delete(widget);
            set((widgets = Array.from(widgetsSet)));
        },
        new(node) {
            let widget;
            if (node === SelectorNode.addresses_number_distribution) {
                widget = newWidget(HolderDistributionWidget);
            }
            else if (node === SelectorNode.addresses_balance_distribution) {
                widget = newWidget(HolderDistributionBalanceWidget);
            }
            else if (node === SelectorNode.labeled_addresses_number_distribution) {
                widget = newWidget(HolderDistributionLabeledWidget);
            }
            else if (node === SelectorNode.price_daa_divergence) {
                widget = newWidget(PriceDAAWidget);
            }
            else if (node === SelectorNode.adjusted_price_daa_divergence) {
                widget = newWidget(AdjustedPriceDAAWidget);
            }
            else {
                widget = getExternalWidget === null || getExternalWidget === void 0 ? void 0 : getExternalWidget(node);
            }
            if (!widget)
                return;
            function redo() {
                widget.scrollOnMount = true;
                widgets.push(widget);
                set(widgets);
            }
            redo();
            History.add('New widget', () => widget === null || widget === void 0 ? void 0 : widget.delete(), redo);
            track.event(Event.NewWidget, { widget: node.key });
        },
        addSubwidgets(widget, subwidgets) {
            const subwidgetsSet = new Set(widget.subwidgets.concat(subwidgets));
            widget.subwidgets = Array.from(subwidgetsSet);
            set(widgets);
        },
    };
    setWidgets(store);
    return store;
}
export const SidewidgetType = {
    LAYOUT_COMMENTS: 'LAYOUT_COMMENTS',
    EXPLAIN_METRICS: 'METRICS_EXPLANATION_PANE',
};
const SIDEWIDGET_CONTEXT = 'sidewidget';
export const setSidewidget = (sidewidget) => setContext(SIDEWIDGET_CONTEXT, sidewidget);
export const getSidewidget = () => getContext(SIDEWIDGET_CONTEXT);
export function initSidewidget(defaultValue) {
    let sidewidget = defaultValue;
    const { subscribe, set } = writable(defaultValue);
    const store = {
        subscribe,
        set(value) {
            sidewidget = sidewidget === value ? undefined : value;
            set(sidewidget);
            // prettier-ignore
            if (sidewidget)
                track.event(Event.Sidewidget, { sidewidget: value.key || value });
        },
    };
    setSidewidget(store);
    return store;
}
//# sourceMappingURL=widgets.js.map