<script lang="ts">import { getTodaysEnd } from 'san-webkit/lib/utils/dates';
import { studio } from './../../lib/stores/studio';
import { FORMATTER } from './../../lib/metrics/formatters';
import { getDefaultTooltipSettings } from './../../lib/Chart/utils';
import { themes } from './../../lib/Chart/theme';
import Addons from './Addons/index.svelte';
import Chart from './../../lib/Chart/index.svelte';
import Candles from './../../lib/Chart/Candles.svelte';
import Lines from './../../lib/Chart/Lines.svelte';
import Areas from './../../lib/Chart/Areas.svelte';
import Bars from './../../lib/Chart/Bars.svelte';
import GreenRedBars from './../../lib/Chart/GreenRedBars.svelte';
import CartesianGrid from './../../lib/Chart/CartesianGrid.svelte';
import Tooltip from './../../lib/Chart/Tooltip/index.svelte';
import Axes from './../../lib/Chart/Axes/index.svelte';
import { getResponsiveAxesKeys, getXTicksByWidth } from './../../lib/Chart/Axes/utils';
import Brush from './../../lib/Chart/Brush/index.svelte';
import Drawer from './../../lib/Chart/Drawer/index.svelte';
import Watermark from './../../lib/Chart/Watermark.svelte';
import ReferenceDots from './../../lib/Chart/ReferenceDots.svelte';
import { globals } from './../../lib/stores/globals';
import { getAdapterController } from './../../lib/adapter/context';
import { newDomainModifier } from './domain';
import { getWidget } from './context';
const widget = getWidget();
const {
  isEmbedded,
  onChartPointClick,
  onModRangeSelect = () => {}
} = getAdapterController();
const {
  ChartAxes,
  ChartOptions,
  ChartAddons
} = widget;
const {
  MetricSettings,
  ChartMetricDisplays,
  SignalsTimeseries
} = widget;
export let metrics;
export let data = [];
export let allTimeData;
export let colors;
export let categories;
export let domainGroups;
export let from, to;
export let isFullscreened;
export let onChart, changeStudioPeriod;
let chartWidth;

const getKey = ({
  key
}) => key;

$: ({
  ticker
} = $studio);

$: references = $SignalsTimeseries;

$: axesMetricKeys = Array.from($ChartAxes).map(getKey);

$: metricSettings = getTooltipSettings(metrics, references, ticker, $ChartMetricDisplays);

$: theme = themes[+$globals.isNightMode];

$: domainModifier = newDomainModifier(metrics, $MetricSettings, widget);

$: drawingKey = axesMetricKeys[0] || metrics[0] && metrics[0].key;

const labelGetter = (ticker, {
  base,
  label
}) => base ? label : label + ` (${ticker})`;

function getTooltipSettings(metrics, references, ticker, MetricDisplays) {
  const metricSettings = getDefaultTooltipSettings();
  metrics.forEach(metric => {
    const {
      key,
      formatter = FORMATTER,
      getLabel,
      axisFormatter
    } = metric;
    const metricLabel = (getLabel || labelGetter)(ticker, metric);
    metricSettings[key] = Object.assign({
      label: metricLabel,
      formatter,
      axisFormatter
    }, MetricDisplays[key]);
  });
  references.forEach(({
    key,
    label,
    formatter
  }) => {
    metricSettings[key] = {
      label,
      formatter
    };
  });
  return metricSettings;
}

function onBrushChange(startIndex, endIndex) {
  const start = allTimeData[startIndex];
  const end = allTimeData[endIndex];

  if (start && end) {
    changeStudioPeriod(start.datetime, endIndex === allTimeData.length - 1 ? getTodaysEnd() : end.datetime);
  }
}

function onPointClick(point, e) {
  if (onChartPointClick) onChartPointClick(point, e);
}

const RANGE_SELECT_SENSITIVITY = 7;

function onRangeSelect(start, end, e) {
  if (start && end) {
    const shouldSwap = start.value > end.value;

    let _start = shouldSwap ? end : start;

    let _end = shouldSwap ? start : end;

    const {
      ctrlKey,
      metaKey,
      shiftKey
    } = e;

    if (ctrlKey || metaKey || shiftKey) {
      return onModRangeSelect(_start, _end, e);
    }

    if (Math.abs(_start.x - _end.x) < RANGE_SELECT_SENSITIVITY) return;
    changeStudioPeriod(_start.value, _end.value);
  }
}</script>

<Chart
  {data}
  scale={$ChartOptions.scale}
  {categories}
  {colors}
  {theme}
  {metricSettings}
  {domainGroups}
  {domainModifier}
  {onChart}
  disabled={isFullscreened}
  bind:width={chartWidth}
>
  <GreenRedBars />
  <Bars />
  <Areas />
  <Candles />
  <Lines />

  <ReferenceDots {references} />

  {#if $ChartOptions.cartesianGrid} <CartesianGrid /> {/if}
  <Axes
    axesMetricKeys={getResponsiveAxesKeys(chartWidth, axesMetricKeys)}
    {metricSettings}
    xTicks={getXTicksByWidth(chartWidth)}
  />

  {#if !isFullscreened} <Drawer {axesMetricKeys} metricKey={drawingKey} /> {/if}

  {#if process.browser}
    <Tooltip
      {axesMetricKeys}
      {metricSettings}
      {onPointClick}
      {onRangeSelect}
      isShiftForced={isEmbedded}
    />
  {/if}

  <Addons addons={$ChartAddons} slug={$studio.slug} isPro={$globals.isPro || $globals.isProPlus} />

  {#if $ChartOptions.watermark}
    <Watermark isLessVisible={$ChartOptions.isWatermarkLessVisible} />
  {/if}

  {#if allTimeData}
    <Brush data={allTimeData} {categories} {colors} {from} {to} {theme} onChange={onBrushChange} />
  {/if}
</Chart>
