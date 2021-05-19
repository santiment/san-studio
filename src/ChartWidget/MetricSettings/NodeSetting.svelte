<script lang="ts">
  import type { ChartNodes } from '@/Chart/nodes'
  import type { MetricSetting } from './context'
  import { Node, BARS } from '@/Chart/nodes'
  import Dropdown from './Dropdown.svelte'
  import { getMetricSettings } from './context'
  const MetricSettings = getMetricSettings()

  export let metric: Studio.Metric

  $: metricSettings = $MetricSettings[metric.key]
  $: metricNode = getMetricNode(metric, metricSettings)

  const NodeToLabel = {}
  function buildNode(id: ChartNodes, label: string) {
    NodeToLabel[id] = label
    return { id, label }
  }
  const NODES = [
    buildNode(Node.AREA, 'Area'),
    buildNode(Node.LINE, 'Line'),
    buildNode(Node.FILLED_LINE, 'Filled line'),
    buildNode(Node.GRADIENT_LINE, 'Gradient line'),
    buildNode(Node.BAR, 'Bar'),
  ]

  function onClick(node) {
    if (
      node.id === metric.node ||
      (node.id === Node.BAR && BARS.has(metric.node as any))
    ) {
      return MetricSettings.delete(metric.key, 'node')
    }

    MetricSettings.set(metric.key, {
      node: node.id,
    })
  }

  function getMetricNode(
    metric: Studio.Metric,
    metricSettings?: MetricSetting,
  ) {
    const node = (metricSettings?.node || metric.node) as ChartNodes
    return BARS.has(node as any) ? Node.BAR : node
  }
</script>

<Dropdown>
  Style: {NodeToLabel[metricNode]}

  <svelte:fragment slot="options">
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
