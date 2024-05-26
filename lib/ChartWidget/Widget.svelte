<script>import { track } from 'san-webkit/lib/analytics';
import { withScroll } from 'san-webkit/lib/ui/history';
import { Event } from './../analytics';
import { getHistoryContext } from './../history/ctx';
import { studio } from './../stores/studio';
import { globals } from './../stores/globals';
import { getAdapterController } from './../adapter/context';
import { ALL_COLORS } from './../Chart/colors';
import Logic from './Logic.svelte';
import Chart from './Chart.svelte';
import Controls from './Controls/index.svelte';
import MetricsRow from './Metrics/index.svelte';
import MetricSettingsRow from './MetricSettings/index.svelte';
import { initWidget, initWidgetContext, getOnLoadContext, dispatchWidgetDataLoaded, } from './context';
import { DatesMessage } from './../EmbeddableChartWidget/utils';
import { Node } from './../Chart/nodes';
import { minimized$ } from './../EmbeddableChartWidget/store';
const { onWidgetInit, isWithMetricSettings = true, isOnlyChartEmbedded, isMinimapEmbedded = false, } = getAdapterController();
const History = getHistoryContext();
let className = '';
export { className as class };
export let widget;
export let rawData = [];
export let allTimeData;
export let isSingleWidget;
export let deleteWidget = undefined;
export let metricsFilter = undefined;
export let fullscreenMetricsFilter = undefined;
export let MetricError;
export let loadings;
export let isFullscreen;
export let onLoad = getOnLoadContext();
initWidget(widget);
initWidgetContext(widget);
if (onWidgetInit)
    onWidgetInit(widget);
const { ChartAxes, ChartColors, ChartDrawer, ChartOptions, ChartAddons, HiddenMetrics } = widget;
const { Metrics, MetricSettings, MetricIndicators } = widget;
const { MetricsSignals } = widget;
const { IsLoaded, OnUpdate } = widget;
let chart;
let isSharedAxisEnabled = widget.isSharedAxisEnabled || false;
let ChartAddonError = new Map();
let isFullscreened = false;
$: metrics = $Metrics;
$: displayedMetrics = metricsFilter ? metrics.filter(metricsFilter) : metrics;
$: settingsOpenedMetric = getSettingsOpenedMetric(displayedMetrics);
$: isLoaded = loadings.size === 0;
$: IsLoaded.set(isLoaded);
$: onLoad && isLoaded && onLoad(widget);
$: process.browser && isLoaded && dispatchWidgetDataLoaded(widget);
// prettier-ignore
$: ($ChartAxes, $ChartColors, $MetricIndicators, $MetricSettings, $ChartDrawer,
    $MetricsSignals, $ChartOptions, $ChartAddons, OnUpdate.emit());
widget.setChartAddonError = (addon, error) => {
    ChartAddonError.set(addon, error);
    ChartAddonError = ChartAddonError;
};
widget.deleteChartAddonError = (addon) => {
    ChartAddonError.delete(addon);
    ChartAddonError = ChartAddonError;
};
function changeStudioPeriod(startDatetime, endDatetime) {
    if (isMinimapEmbedded) {
        const from = new Date(startDatetime);
        const to = new Date(endDatetime);
        studio.setPeriod(from, to);
        DatesMessage.send({ from: from.toISOString(), to: to.toISOString() });
        return;
    }
    if (isOnlyChartEmbedded)
        return;
    const { from, to } = $studio;
    const undo = () => studio.setPeriod(new Date(from), new Date(to));
    const redo = () => studio.setPeriod(new Date(startDatetime), new Date(endDatetime));
    History.add('Period change', undo, redo);
    redo();
}
const onMetricSettings = (metric) => (settingsOpenedMetric = metric);
function onMetricClick(metric, e) {
    if (metric.node === Node.REFERENCE)
        return;
    if (e.altKey) {
        HiddenMetrics.toggle(metric);
        return;
    }
    if (e.target === e.currentTarget) {
        track.event(Event.MetricSettings, { metric: metric.key });
        settingsOpenedMetric = metric;
    }
}
function onMetricDelete(metric) {
    if (metrics.length === 1)
        return deleteWidget();
    const oldMetrics = $Metrics.slice();
    const redo = () => Metrics.delete(metric);
    const undo = () => Metrics.set(oldMetrics);
    History.add('Delete metric', undo, redo);
    redo();
}
function getSettingsOpenedMetric(metrics) {
    if (!settingsOpenedMetric || metrics.indexOf(settingsOpenedMetric) === -1) {
        const metric = metrics[0];
        return (metric === null || metric === void 0 ? void 0 : metric.node) !== Node.REFERENCE ? metric : null;
    }
    return settingsOpenedMetric;
}
function onMetricLock(oldMetric, newMetric, index) {
    lockMetric(newMetric, index);
    History.add('Lock metric', withScroll(widget, () => lockMetric(oldMetric, index)), withScroll(widget, () => lockMetric(newMetric, index)));
}
function lockMetric(metric, index) {
    const oldMetric = metrics[index];
    if (settingsOpenedMetric === oldMetric) {
        settingsOpenedMetric = metric;
    }
    const oldKey = oldMetric.key;
    const oldColor = ChartColors.get()[oldKey];
    if (!ALL_COLORS.has(oldColor)) {
        ChartColors.replace(oldKey, metric.key);
    }
    MetricSettings.replace(oldKey, metric.key);
    Metrics.replace(index, metric);
}
function onChart(newChart) {
    if (!isFullscreen)
        widget.chart = newChart;
    chart = newChart;
}
</script>

<Logic
  {widget}
  {rawData}
  {isSharedAxisEnabled}
  {MetricError}
  let:data
  let:colors
  let:nodes={categories}
  let:domainGroups
  let:hasDomainGroups
  let:onMetricHover
>
  <div class="widget column {className}">
    {#if isOnlyChartEmbedded !== true && $minimized$.minimized === false}
      <Controls
        {chart}
        {isSingleWidget}
        {deleteWidget}
        {hasDomainGroups}
        {fullscreenMetricsFilter}
        {isFullscreen}
        bind:isFullscreened
        bind:isSharedAxisEnabled
      />
    {/if}

    <slot />

    {#if $minimized$.minimized === false}
      <MetricsRow
        {chart}
        metrics={displayedMetrics}
        {settingsOpenedMetric}
        {loadings}
        {colors}
        {MetricError}
        {ChartAddonError}
        {isSingleWidget}
        {changeStudioPeriod}
        {onMetricClick}
        {onMetricHover}
        {onMetricDelete}
        {onMetricLock}
        {onMetricSettings}
      >
        <slot name="metrics-right" />
      </MetricsRow>
    {/if}

    {#if isWithMetricSettings && settingsOpenedMetric && $globals.isPresenterMode === false && $minimized$.minimized === false}
      <MetricSettingsRow metric={settingsOpenedMetric} />
    {/if}

    <Chart
      {metrics}
      {data}
      {allTimeData}
      {colors}
      {categories}
      {domainGroups}
      from={$studio.from}
      to={$studio.to}
      {isFullscreened}
      {changeStudioPeriod}
      {onChart}
    />
  </div>
</Logic>

<style>
  .widget {
    height: 100%;
    flex: 1;
    min-width: 0;
  }
</style>
