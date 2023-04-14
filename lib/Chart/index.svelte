<svelte:options immutable />

<script>import { onMount, getContext } from 'svelte';
import { initChart, updateChartState, updateChartDimensions, updateSize } from '@santiment-network/chart';
import { linearScale } from '@santiment-network/chart/scales';
import { themes } from './theme';
import { setChart, newPlotManager } from './context';
import { clearCtx } from './utils';
const DEFAULT_PADDING = {
  left: 0,
  top: 7,
  bottom: 0,
  right: 0
};
export let padding;
export let width = undefined;
export let height = undefined;
export let data;
export let categories;
export let colors;
export let domainGroups = undefined;
export let domainModifier = undefined;
export let scale = linearScale;
export let theme = themes[0];
export let metricSettings = undefined;
export let onChart = undefined;
export let disabled = false;
const SSR_CHART = getContext('SSR_CHART');
let chart = SSR_CHART;
let canvas = (chart === null || chart === void 0 ? void 0 : chart.canvas) || undefined;
let shouldRedraw = 1;

if (SSR_CHART) {
  width = chart.canvasWidth;
  height = chart.canvasHeight;
  padding = Object.assign({}, DEFAULT_PADDING, chart.padding);
  setupChart(chart);

  chart.setPadding = newPadding => {
    padding = newPadding;
    updateChartDimensions(chart, width, height, newPadding);
  };
}

$: setChart(chart);

$: chart && width && height && padding && updateDimensions();

$: chart && (chart.metricSettings = metricSettings); // prettier-ignore


$: chart && ( // @ts-ignore
disabled, theme, shouldRedraw, categories, colors, scale, domainGroups, data, drawChart(chart));

onMount(() => {
  const _width = width || canvas.parentNode.offsetWidth;

  const _height = height || canvas.parentNode.offsetHeight;

  chart = initChart(canvas, _width, _height, padding || DEFAULT_PADDING);
  setupChart(chart);
  chart.setPadding = setPadding;
  if (onChart) onChart(chart);
});

function setupChart(chart) {
  chart.theme = theme;

  chart.redraw = () => shouldRedraw += 1;

  chart.plotManager = newPlotManager();
  chart.rightAxisMargin = chart.rightAxisMargin || 0;
}

function setPadding(newPadding) {
  padding = newPadding;
  const parent = canvas.parentNode;

  const _width = width || parent.offsetWidth;

  const _height = height || parent.offsetHeight;

  updateChartDimensions(chart, _width, _height, newPadding);
  chart.redraw();
}

function drawChart(chart) {
  if (disabled) return;
  clearCtx(chart);
  chart.theme = theme;
  chart.bgColor = theme.bg;
  chart.data = data;
  chart.categories = categories;
  chart.colors = colors;
  chart.scale = scale;
  chart.domainGroups = domainGroups;
  chart.domainModifier = domainModifier;

  if (data.length === 0) {
    chart.points = [];
  } else {
    if (!process.browser) return;
    updateChartState(chart, data, categories.joinedCategories, domainModifier, domainGroups, new Set(categories.candles));
    chart.plotManager.items.forEach(plot => {
      plot(chart, scale, data, colors, categories);
    });
    chart.plotManager.emitDrawFinish();
  }
}

function updateDimensions() {
  if (disabled) return;
  const {
    tooltip,
    brush,
    drawer,
    canvasWidth,
    canvasHeight
  } = chart;

  const _width = width || canvasWidth;

  const _height = height || canvasHeight;

  updateChartDimensions(chart, _width, _height, padding);

  if (tooltip) {
    updateSize(tooltip.canvas, tooltip.ctx, chart.dpr, _width, _height);
  }

  if (brush) {
    brush.updateWidth(_width);
  }

  if (drawer) {
    updateSize(drawer.canvas, drawer.ctx, chart.dpr, _width, _height);
    drawer.redraw();
  }

  chart.redraw();
}</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={canvas} />
  {#if chart}
    <slot />
  {/if}
</div>

<style>
  .chart {
    flex: 1;
    position: relative;
    line-height: 0;
    min-height: 0;
    max-height: 100%;
  }
</style>
