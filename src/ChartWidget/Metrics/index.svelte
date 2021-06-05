<script lang="ts">
  import { globals } from '@/stores/globals'
  import Metric from './Metric.svelte'
  import AutoUpdate from './AutoUpdate.svelte'

  export let metrics, colors, loadings
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
      isLoading={loadings.has(metric)}
      onClick={onMetricClick}
      onHover={onMetricHover}
      onDelete={isSingleWidget && metrics.length === 1
        ? undefined
        : onMetricDelete}
      onLock={onMetricLock}
      onSettings={onMetricSettings} />
  {/each}

  {#if $globals.isPresenterMode === false}
    <AutoUpdate />
  {/if}
</div>

<style>
  .metrics {
    margin-left: -8px;
    flex-wrap: wrap;
  }
</style>
