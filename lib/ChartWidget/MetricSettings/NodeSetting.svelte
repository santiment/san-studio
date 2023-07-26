<script>import { track } from 'san-webkit/lib/analytics';
import { withScroll } from 'san-webkit/lib/ui/history';
import { cleanupCandlesSettings, setCandlesSettings } from './../../ChartWidget/transformers/candles';
import { getHistoryContext } from './../../history/ctx';
import { studio } from './../../stores/studio';
import { Node, NodeAlias } from './../../Chart/nodes';
import { Metric } from './../../metrics';
import { Event } from './../../analytics';
import Dropdown from './Dropdown.svelte';
import { getWidget } from '../context';
const History = getHistoryContext();
const widget = getWidget();
const { MetricSettings, ChartMetricDisplays } = widget;
export let metric;
$: metricSettings = $MetricSettings[metric.key];
$: metricNode = getMetricNode(metric, metricSettings);
const NodeToLabel = {};
const IdToNode = {};
function buildNode(id, label) {
    const node = { id, label };
    NodeToLabel[id] = label;
    IdToNode[id] = node;
    return node;
}
const CANDLES_NODE = buildNode(Node.CANDLES, 'Candles');
const PN_BARS_NODE = buildNode(Node.GREEN_RED_BAR, 'P/N Bars');
const NODES = [
    buildNode(Node.AREA, 'Area'),
    buildNode(Node.LINE, 'Line'),
    buildNode(Node.FILLED_LINE, 'Filled area'),
    buildNode(Node.GRADIENT_LINE, 'Gradient line'),
    buildNode(Node.BAR, 'Bars'),
];
function onClick(metric, metricSettings, oldNode, newNode) {
    setMetricNode(metric, metricSettings, oldNode, newNode);
    track.event(Event.MetricNode, { metric: metric.key, type: newNode.label });
    History.add('Style change', withScroll(widget, () => setMetricNode(metric, metricSettings, newNode.id, IdToNode[oldNode])), withScroll(widget, () => setMetricNode(metric, metricSettings, oldNode, newNode)));
}
function setMetricNode(metric, metricSettings, oldNode, newNode) {
    if (oldNode === Node.CANDLES && newNode.id !== Node.CANDLES) {
        cleanupCandlesSettings(metric, metricSettings, ChartMetricDisplays);
    }
    if (newNode.id === metric.node) {
        return MetricSettings.delete(metric.key, 'node');
    }
    if (newNode.id === Node.CANDLES) {
        setCandlesSettings(metric, metricSettings, $studio, ChartMetricDisplays);
    }
    MetricSettings.set(metric.key, {
        node: newNode.id,
    });
}
function getMetricNode(metric, metricSettings) {
    const node = ((metricSettings === null || metricSettings === void 0 ? void 0 : metricSettings.node) || metric.node);
    return NodeAlias[node] || node;
}
</script>

<Dropdown>
  {#key metric}
    Style: {NodeToLabel[metricNode]}
  {/key}

  <svelte:fragment slot="options">
    {#key metric}
      {#if !metric.indicator && (metric.base || metric) === Metric.price_usd}
        <div
          class="btn-ghost"
          class:active={metricNode === CANDLES_NODE.id}
          on:click={() => onClick(metric, metricSettings, metricNode, CANDLES_NODE)}
        >
          {CANDLES_NODE.label}
        </div>
      {/if}

      {#each NODES as node}
        <div
          class="btn-ghost"
          class:active={metricNode === node.id}
          on:click={() => onClick(metric, metricSettings, metricNode, node)}
        >
          {node.label}
        </div>
      {/each}

      {#if metric === Metric.bitmex_perpetual_funding_rate}
        <div
          class="btn-ghost"
          class:active={metricNode === PN_BARS_NODE.id}
          on:click={() => onClick(metric, metricSettings, metricNode, PN_BARS_NODE)}
        >
          {PN_BARS_NODE.label}
        </div>
      {/if}
    {/key}
  </svelte:fragment>
</Dropdown>
