<script lang="ts">import { onDestroy } from 'svelte';
import { getHistoryContext, withScroll } from 'san-webkit/lib/ui/history';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { newGlobalShortcut } from 'san-webkit/lib/utils/events';
import { mapview, MapviewPhase } from './../../lib/stores/mapview';
import { getWidgets } from './../../lib/stores/widgets';
import { selectedItems } from './../../lib/stores/selector';
import { getAdapterController } from './../../lib/adapter/context';
import Preview from './Preview.svelte';
import ChartPreview from './ChartPreview.svelte';
import Grid from './Grid.svelte';
const Widgets = getWidgets();
const {
  adjustSelectedMetric
} = getAdapterController();
const History = getHistoryContext();

$: widgets = $Widgets;

$: mapview.checkActiveMetrics($selectedItems.metrics.length > 0 || $selectedItems.subwidgets.length > 0 || $selectedItems.chartAddons.length > 0);

$: isMapview = $mapview !== MapviewPhase.None;

$: isMetricsPhase = $mapview === MapviewPhase.Metrics;

function onWidgetClick(widget, e) {
  if ($mapview === MapviewPhase.Overview || widget.isBlocked) {
    widget.scrollIntoView();
    mapview.exit();
    return;
  }

  if ($selectedItems.subwidgets.length) {
    Widgets.addSubwidgets(widget, $selectedItems.subwidgets);
  }

  if ($selectedItems.chartAddons.length) {
    widget.ChartAddons.concat($selectedItems.chartAddons);
  }

  if (widget.Metrics) {
    const metrics = adjustMetrics($selectedItems.metrics);
    const notables = $selectedItems.notables.slice();

    const redo = () => {
      widget.Metrics.concat(metrics);
      widget.MetricsSignals.concat(notables);
    };

    redo();
    History.add('Add metrics', withScroll(widget, () => {
      widget.Metrics.deleteEach(metrics);
      widget.MetricsSignals.deleteEach(metrics);
    }), withScroll(widget, redo));
    if ((e === null || e === void 0 ? void 0 : e.ctrlKey) || (e === null || e === void 0 ? void 0 : e.metaKey)) return;
    selectedItems.clear();
  }
}

function onNewWidgetClick({
  ctrlKey,
  metaKey
}) {
  const widget = Widgets.add(adjustMetrics($selectedItems.metrics));

  if ($selectedItems.chartAddons.length) {
    widget.chartAddons = $selectedItems.chartAddons;
  }

  History.add('New widget', () => widget === null || widget === void 0 ? void 0 : widget.delete(), () => {
    widget.scrollOnMount = true;
    Widgets.push(widget);
  });
  if (ctrlKey || metaKey) return;
  selectedItems.clear();
}

function adjustMetrics(metrics) {
  return adjustSelectedMetric ? metrics.map(adjustSelectedMetric) : metrics;
}

onDestroy(newGlobalShortcut('CMD+M', () => mapview.overview()));</script>

{#if isMapview}
  <Grid {isMetricsPhase} {widgets} let:hiddenWidgets>
    {#each widgets as widget (widget.id)}
      {#if widget.metrics}
        <ChartPreview
          {widget}
          {isMetricsPhase}
          onClick={onWidgetClick}
          wasHiddenWidgets={hiddenWidgets.has(widget)}
        />
      {:else}
        <Preview
          {widget}
          isBlocked={isMetricsPhase}
          class="column hv-center"
          on:click={() => onWidgetClick(widget)}
        >
          <div class="title">
            {widget.previewTitle}
          </div>
        </Preview>
      {/if}
    {/each}

    {#if isMetricsPhase && $selectedItems.metrics.length}
      <Preview class="column hv-center body-2 txt-m new-7KvlTn" on:click={onNewWidgetClick}>
        <Svg illus id="plus" w="45" h="48" class="mrg-l mrg--b" />
        Apply for new chart
      </Preview>
    {/if}
  </Grid>
{/if}

<style>
  .title {
    font-size: 21px;
    color: var(--waterloo);
  }

  :global(.column.new-7KvlTn) {
    color: var(--waterloo);
    border: 1.5px dashed var(--mystic);
  }
  :global(.column.new-7KvlTn::after) {
    display: none !important;
  }
  :global(.column.new-7KvlTn:hover) {
    border: 1.5px dashed var(--green);
    box-shadow: 0px 2px 24px rgba(24, 27, 43, 0.04), 1px 3px 7px rgba(47, 53, 77, 0.05);
  }
</style>
