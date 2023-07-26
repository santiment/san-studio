import { setContext, getContext } from 'svelte';
import { get, writable } from 'svelte/store';
import { newMetricSignalsStore, newSignalsTimeseriesStore } from './signals.js';
import { newMetricDisplayersStore } from './metricDisplayers.js';
import { newChartDrawerStore, setChartDrawer } from './../Chart/Drawer/context.js';
import { newChartAxesStore, newPinnedChartAxesStore } from './../Chart/Axes/context.js';
import { newChartColorsStore } from './../Chart/colors/context.js';
import { newChartOptionsStore } from './../ChartWidget/Controls/context.js';
import { newMetricsStore, newHiddenMetricsStore } from './../ChartWidget/Metrics/context.js';
import { newMetricSettingsStore } from './../ChartWidget/MetricSettings/context.js';
import { newMetricIndicatorsStore } from './../ChartWidget/MetricSettings/IndicatorSetting/context.js';
import { newChartAddonsStore } from './../ChartWidget/Addons/contex.js';
const CONTEXT = 'widget';
export const setWidget = (widget) => setContext(CONTEXT, widget);
export const getWidget = () => getContext(CONTEXT);
export function initWidget(widget) {
    if (!widget.ChartAxes)
        widget.ChartAxes = newChartAxesStore(widget.axesMetrics, widget.disabledAxesMetrics);
    if (!widget.PinnedChartAxes)
        widget.PinnedChartAxes = newPinnedChartAxesStore(widget.pinnedAxes);
    if (!widget.ChartDrawer)
        widget.ChartDrawer = newChartDrawerStore(widget.drawings);
    if (!widget.ChartColors)
        widget.ChartColors = newChartColorsStore(widget.colors);
    if (!widget.ChartOptions)
        widget.ChartOptions = newChartOptionsStore(widget);
    if (!widget.ChartMetricDisplays)
        widget.ChartMetricDisplays = newMetricDisplayersStore();
    if (!widget.Metrics)
        widget.Metrics = newMetricsStore(widget.metrics);
    if (!widget.HiddenMetrics)
        widget.HiddenMetrics = newHiddenMetricsStore(widget.hiddenMetrics);
    if (!widget.MetricsSignals)
        widget.MetricsSignals = newMetricSignalsStore(widget.signalMetrics);
    if (!widget.SignalsTimeseries)
        widget.SignalsTimeseries = newSignalsTimeseriesStore();
    if (!widget.MetricSettings)
        widget.MetricSettings = newMetricSettingsStore(widget.metricSettings);
    if (!widget.MetricIndicators)
        widget.MetricIndicators = newMetricIndicatorsStore(widget.metricIndicators);
    if (!widget.ChartAddons)
        widget.ChartAddons = newChartAddonsStore(widget.chartAddons);
    if (!widget.IsLoaded)
        widget.IsLoaded = writable(false);
    if (!widget.OnUpdate)
        widget.OnUpdate = newOnUpdateStore(widget);
}
export function newOnUpdateStore(widget) {
    let i = 0;
    const { subscribe, set } = writable(i);
    return {
        subscribe,
        emit() {
            var _a;
            widget.metrics = get(widget.Metrics);
            widget.hiddenMetrics = get(widget.HiddenMetrics);
            widget.metricIndicators = get(widget.MetricIndicators);
            widget.metricSettings = get(widget.MetricSettings);
            widget.drawings = get(widget.ChartDrawer).drawings;
            widget.colors = get(widget.ChartColors);
            widget.axesMetrics = get(widget.ChartAxes);
            widget.pinnedAxes = get(widget.PinnedChartAxes);
            widget.signalMetrics = get(widget.MetricsSignals);
            (_a = widget.onWidgetUpdate) === null || _a === void 0 ? void 0 : _a.call(widget);
            set(i++);
        },
    };
}
export function initWidgetContext(widget) {
    setWidget(widget);
    setChartDrawer(widget.ChartDrawer);
}
const ON_LOAD_CONTEXT = 'ON_LOAD';
export const setOnLoadContext = (onLoad) => setContext(ON_LOAD_CONTEXT, onLoad);
export const getOnLoadContext = () => getContext(ON_LOAD_CONTEXT);
const WIDGET_DATA_LOADED = 'WIDGET_DATA_LOADED';
export const dispatchWidgetDataLoaded = (widget) => window.dispatchEvent(new CustomEvent(WIDGET_DATA_LOADED, { detail: widget }));
export const subscribeWidgetDataLoadedEvent = (clb) => {
    window.addEventListener(WIDGET_DATA_LOADED, clb);
    return () => window.removeEventListener(WIDGET_DATA_LOADED, clb);
};
//# sourceMappingURL=context.js.map