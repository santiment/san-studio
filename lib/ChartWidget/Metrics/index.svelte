<script lang="ts">import { tick } from 'svelte';
import { newSortableContext } from 'san-webkit/lib/ui/dnd/sortable';
import { getAdapterController } from './../../../lib/adapter/context';
import { globals } from './../../../lib/stores/globals';
import { getAutoUpdater } from './../../../lib/stores/autoUpdater';
import { getWidget } from './../../../lib/ChartWidget/context';
import Metric from './Metric.svelte';
import AutoUpdate from './AutoUpdate.svelte';
const {
  isOnlyChartEmbedded
} = getAdapterController();
const {
  Metrics,
  HiddenMetrics,
  ChartAddons
} = getWidget();
const AutoUpdater = getAutoUpdater();
const dndContext = $globals.isBeta ? newSortableContext({
  onDragEnd
}) : undefined;
export let metrics, colors, loadings, settingsOpenedMetric;
export let MetricError, ChartAddonError;
export let isSingleWidget;
export let changeStudioPeriod;
export let onMetricClick, onMetricHover, onMetricDelete, onMetricLock, onMetricSettings;

function onDragEnd(oldIndex, newIndex) {
  if (oldIndex === newIndex) return;
  const newMetrics = metrics.slice();
  const metric = newMetrics.splice(oldIndex, 1)[0];
  newMetrics.splice(newIndex, 0, metric);
  Metrics.set(newMetrics);
  tick().then(dndContext.ctx.recalcGrid);
}

let hoveredMetric;
let hoverTimer;

const clearHover = () => clearTimeout(hoverTimer);

$: isMultipleMetricsOnChart = metrics.length > 1;

$: hiddenMetrics = $HiddenMetrics;

function hoverMetric(metric) {
  hoveredMetric = metric;
  onMetricHover(metric);
}

function onMetricEnter(metric) {
  clearHover();
  if (hoveredMetric) return hoverMetric(metric);
  hoverTimer = window.setTimeout(() => hoverMetric(metric), 120);
}

function onMetricLeave() {
  clearHover();
  if (hoveredMetric) hoverTimer = window.setTimeout(() => hoverMetric(), 100);
}</script>

<div class="row">
  <div class="metrics row">
    {#each metrics as metric, i (i)}
      <Metric
        {dndContext}
        {metric}
        {colors}
        {isMultipleMetricsOnChart}
        error={MetricError.get(metric)}
        isHidden={hiddenMetrics.has(metric)}
        isLoading={loadings.has(metric)}
        isSettingsOpened={settingsOpenedMetric === metric}
        onClick={onMetricClick}
        onEnter={onMetricEnter}
        onLeave={onMetricLeave}
        onDelete={isSingleWidget && metrics.length === 1 ? undefined : onMetricDelete}
        onLock={onMetricLock}
        onSettings={onMetricSettings}
      />
    {/each}
    {#each $ChartAddons as metric}
      <Metric
        {metric}
        error={ChartAddonError.get(metric)}
        onClick={onMetricClick}
        onEnter={onMetricEnter}
        onLeave={onMetricLeave}
        onDelete={() => ChartAddons.delete(metric)}
        onSettings={onMetricSettings}
      />
    {/each}
  </div>

  {#if !isOnlyChartEmbedded && $globals.isPresenterMode === false && AutoUpdater}
    <AutoUpdate {AutoUpdater} {changeStudioPeriod} />
  {/if}
</div>

<style>
  .metrics {
    margin-left: -8px;
    flex-wrap: wrap;
    flex: 1;
  }
</style>
