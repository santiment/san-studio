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
  import { newDrawer } from './drawer'
  import { handleMouseIntersection, getDrawingHoverPainter } from './hovered'
  import { handleMouseSelect } from './selectAndDrag'
  import {
    updateCoordinates,
    newAbsoluteToRelativeCoordinatesUpdater,
  } from './coordinates'
  import { newDrawingAxesPainter } from './axes'

  const chart = getChart()
  const ChartDrawer = getChartDrawer()
  const drawer = newDrawer(chart)

  export let metricKey: string
  export let axesMetricKeys: string[]

  const removeMouseIntersectionHandler = handleMouseIntersection(
    chart,
    setHovered,
  )

  handleMouseSelect(chart, {
    selectDrawing,
    onLineDelete: console.log,
    startDrawing,
    stopDrawing,
    onDrawingDragEnd,
  })

  // $: ({ drawings } = $ChartDrawer)

  $: drawings = [
    {
      type: 'sticker',
      id: 'rocket',
      size: 50,
      // absCoor: [100, 100],
      absCoor: [],
      relCoor: [1629881445421, 3000],
    },
  ]
  $: drawer.drawings = drawings
  $: drawer.metricKey = metricKey

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

  function setHovered(drawing?: any) {
    if (drawer.hovered !== drawing) updateCursor(drawing && 'pointer')
    drawer.hovered = drawing
  }
  function updateCursor(cursor?: string) {
    console.log('cursor change')
    const { canvas } = chart.tooltip || chart
    canvas.style.cursor = cursor || 'initial'
  }

  function onDrawingDragEnd(drawing: Drawing) {}

  function selectDrawing(drawing?: Drawing) {
    if (drawer.selected === drawing) return

    drawer.selected = drawing
    $ChartDrawer.selectedLine = drawing

    if (drawing) {
      const hoverPainter = getDrawingHoverPainter(drawing)
      if (!hoverPainter) return
      const { minMax } = drawer
      if (!minMax) return

      const drawingAxesPainter = newDrawingAxesPainter(chart, drawing)
      drawer.drawSelection = () => {
        hoverPainter(drawer, drawing)
        drawingAxesPainter()
      }
      drawer.updateSelectionCoordinates = newAbsoluteToRelativeCoordinatesUpdater(
        chart,
        minMax,
      )
    } else {
      drawer.drawSelection = undefined
      drawer.updateSelectionCoordinates = undefined
    }
  }

  onDestroy(() => {
    plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
