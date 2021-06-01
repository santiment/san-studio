<script lang="ts">
  import Metric from './Metric.svelte'
  import AutoUpdate from './AutoUpdate.svelte'

  export let metrics, colors
  export let MetricError
  export let isSingleWidget
  export let onMetricClick,
    onMetricHover,
    onMetricDelete,
    onMetricLock,
    onMetricSettings
</script>

<div class="metrics row">
  {#each metrics as metric, i (i)}
    <Metric
      {metric}
      {colors}
      error={MetricError.get(metric)}
      onClick={onMetricClick}
      onHover={onMetricHover}
      onDelete={isSingleWidget && metrics.length === 1
        ? undefined
        : onMetricDelete}
      onLock={onMetricLock}
      onSettings={onMetricSettings} />
  {/each}

  <AutoUpdate />
</div>

<style>
  .metrics {
    margin-left: -8px;
    flex-wrap: wrap;
  }
</style>
