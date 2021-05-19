<script lang="ts">
  import type { ChartNodes } from '@/Chart/nodes'
  import type { MetricSetting } from './context'
  import {
    cleanupCandlesSettings,
    setCandlesSettings,
  } from '@/ChartWidget/transformers/candles'
  import { studio } from '@/stores/studio'
  import { Node, BARS } from '@/Chart/nodes'
  import { Metric } from '@/metrics'
  import Dropdown from './Dropdown.svelte'
  import { getWidget } from '../context'
  const { MetricSettings, ChartMetricDisplays } = getWidget()

  export let metric: Studio.Metric

  $: metricSettings = $MetricSettings[metric.key]
  $: metricNode = getMetricNode(metric, metricSettings)

  const NodeToLabel = {}
  function buildNode(id: ChartNodes, label: string) {
    NodeToLabel[id] = label
    return { id, label }
  }

  const CANDLES_NODE = buildNode(Node.CANDLES, 'Candles')
  const NODES = [
    buildNode(Node.AREA, 'Area'),
    buildNode(Node.LINE, 'Line'),
    buildNode(Node.FILLED_LINE, 'Filled line'),
    buildNode(Node.GRADIENT_LINE, 'Gradient line'),
    buildNode(Node.BAR, 'Bar'),
  ]

  function onClick(node) {
    if (metricNode === Node.CANDLES && node.id !== Node.CANDLES) {
      cleanupCandlesSettings(metric, metricSettings, ChartMetricDisplays)
    }

    if (node.id === metric.node) {
      return MetricSettings.delete(metric.key, 'node')
    }

    if (node.id === Node.CANDLES) {
      setCandlesSettings(metric, metricSettings, $studio, ChartMetricDisplays)
    }

    MetricSettings.set(metric.key, {
      node: node.id,
    })
  }

  function getMetricNode(
    metric: Studio.Metric,
    metricSettings?: MetricSetting,
  ) {
    return (metricSettings?.node || metric.node) as ChartNodes
  }
</script>

<Dropdown>
  Style: {NodeToLabel[metricNode]}

  <svelte:fragment slot="options">
    {#if !metric.indicator && (metric.base || metric) === Metric.price_usd}
      <div
        class="btn btn--ghost"
        class:active={metricNode === CANDLES_NODE.id}
        on:click={() => onClick(CANDLES_NODE)}>
        {CANDLES_NODE.label}
      </div>
    {/if}
    {#each NODES as node}
      <div
        class="btn btn--ghost"
        class:active={metricNode === node.id}
        on:click={() => onClick(node)}>
        {node.label}
      </div>
    {/each}
  </svelte:fragment>
</Dropdown>

<style>
</style>
