<script lang="ts">
  import { onDestroy } from 'svelte'
  import { newCanvas } from 'san-chart'
  import {
    paintDrawingAxes,
    relativeToAbsoluteCoordinates,
    absoluteToRelativeCoordinates,
  } from './utils'

  import {
    handleLineCreation,
    handleLineHover,
    handleLineMouseDown,
  } from './events'
  import { getChartDrawer } from './context'
  import { getChart } from '../context'

  import type { MinMax, Drawing } from './drawer'
  import { paintDrawings, setupDrawings } from './drawer'
  import { handleMouseIntersection } from './hovered'
  import { handleMouseSelect } from './selectAndDrag'

  const chart = getChart()
  const ChartDrawer = getChartDrawer()

  export let metricKey: string
  export let axesMetricKeys: string[]

  const { canvas, plotManager } = chart
  const drawer = newCanvas(chart)
  const { parentNode, nextElementSibling } = canvas
  parentNode.insertBefore(drawer.canvas, nextElementSibling || canvas)

  drawer.redraw = redraw
  chart.drawer = drawer
  plotManager.set('Drawer', updateDrawings)

  const removeMouseIntersectionHandler = handleMouseIntersection(
    chart,
    setHovered,
  )

  handleMouseSelect(chart, {
    selectDrawing: console.log,
    onLineDelete: console.log,
    startDrawing,
    stopDrawing,
    onDrawingDragEnd: console.log,
  })

  // $: ({ drawings } = $ChartDrawer)

  $: drawings = [
    {
      type: 'sticker',
      id: 'rocket',
      size: 50,
      absCoor: [100, 100],
    },
  ]
  $: drawer.drawings = drawings

  function redraw() {
    paintDrawings(chart)
    // paintDrawingAxes(chart)
  }

  function updateDrawings() {
    const minMax = chart.minMaxes[metricKey] as undefined | MinMax
    if (!minMax) return

    const prevMinMax = drawer.minMax
    if (
      !prevMinMax ||
      minMax.min !== prevMinMax.min ||
      minMax.max !== prevMinMax.max
    ) {
      drawer.minMax = minMax
      setupDrawings(chart)
    }

    redraw()
  }

  function addDrawing(drawing) {
    drawer.drawings.push(drawing)
    setDrawings(drawer.drawings)
  }

  const setIsDrawing = (value: boolean) =>
    ($ChartDrawer.isDrawing = chart.isDrawing = value)
  function startDrawing() {
    setIsDrawing(true)
  }
  function stopDrawing() {
    setIsDrawing(false)
  }

  let hovered: undefined | Drawing
  $: updateCursor(hovered && 'pointer')
  function setHovered(drawing?: any) {
    hovered = drawer.hovered = drawing
  }
  function updateCursor(cursor?: string) {
    const { canvas } = chart.tooltip || chart
    canvas.style.cursor = cursor || 'initial'
  }

  onDestroy(() => {
    plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
