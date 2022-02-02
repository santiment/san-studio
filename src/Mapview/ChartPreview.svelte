<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import { initChart } from 'san-chart'
  import Preview from './Preview.svelte'
  import MetricButton from '@/MetricButton.svelte'
  import { clearCtx } from '@/Chart/utils'
  import { subscribeWidgetDataLoadedEvent } from '@/ChartWidget/context'

  export let widget
  export let onClick
  export let isMetricsPhase: boolean
  export let wasHiddenWidgets = false

  const { ChartColors, Metrics, IsLoaded, isBlocked } = widget
  let chart
  let canvas
  let unsubscribeWidgetDataLoaded

  $: $IsLoaded, requestAnimationFrame(drawChart)

  if (!widget.chart) {
    unsubscribeWidgetDataLoaded = subscribeWidgetDataLoadedEvent(({ detail }) => {
      if (detail !== widget) return
      tick()
        .then(tick)
        .then(() => {
          drawChart()
          if (wasHiddenWidgets) widget.hide()
        })
    })
  }

  onMount(() => {
    chart = initChart(canvas, canvas.clientWidth, canvas.clientHeight)
    drawChart()
  })

  function drawChart() {
    if (!chart || !widget.chart) return
    clearCtx(chart)
    chart.ctx.drawImage(widget.chart.canvas, 0, 5, chart.canvasWidth, chart.canvasHeight + 25)
  }

  onDestroy(() => {
    unsubscribeWidgetDataLoaded?.()
  })
</script>

<Preview
  {widget}
  {isMetricsPhase}
  isBlocked={isBlocked && isMetricsPhase}
  on:click={(e) => onClick(widget, e)}>
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
