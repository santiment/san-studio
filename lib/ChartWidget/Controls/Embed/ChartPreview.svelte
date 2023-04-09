<script>import { onMount } from 'svelte';
import { initChart } from '@santiment-network/chart';
import { clearCtx } from './../../../Chart/utils';
export let widget;
let chart;
let canvas;
onMount(() => {
  chart = initChart(canvas, canvas.clientWidth, canvas.clientHeight);
  drawChart();
});

function drawChart() {
  if (!chart || !widget.chart) return;
  clearCtx(chart);
  chart.ctx.drawImage(widget.chart.canvas, 0, 10, chart.canvasWidth, chart.canvasHeight + 10);
}</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
