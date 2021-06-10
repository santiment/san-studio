<script lang="ts">
  import { onMount } from 'svelte'
  import { initChart } from 'san-chart'
  import Preview from './Preview.svelte'
  import MetricButton from '@/MetricButton.svelte'
  import { clearCtx } from '@/Chart/utils'

  export let widget
  export let onClick
  export let isMetricsPhase: boolean

  const { ChartColors, Metrics, IsLoaded, isBlocked } = widget
  let chart
  let canvas

  $: $IsLoaded, requestAnimationFrame(drawChart)

  onMount(() => {
    chart = initChart(canvas, canvas.clientWidth, canvas.clientHeight)
    drawChart()
  })

  function drawChart() {
    if (!chart || !widget.chart) return
    clearCtx(chart)
    chart.ctx.drawImage(
      widget.chart.canvas,
      0,
      0,
      chart.canvasWidth,
      chart.canvasHeight + 25,
    )
  }
</script>

<Preview
  isBlocked={isBlocked && isMetricsPhase}
  {isMetricsPhase}
  on:click={() => onClick(widget)}>
  <canvas bind:this={canvas} />

  {#if isMetricsPhase}
    <div class="preview-info info row hv-center">
      {#if !isBlocked && $Metrics}
        <div class="metrics row">
          {#each $Metrics as metric (metric.key)}
            <MetricButton {metric} colors={$ChartColors} />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</Preview>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }

  .info {
    position: absolute;
    background: rgba(159, 170, 196, 0.6);
  }

  .metrics {
    flex-wrap: wrap;
  }
</style>
