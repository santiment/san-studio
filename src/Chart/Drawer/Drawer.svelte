<script lang="ts">
  import type { Drawing } from './drawer'
  import { onDestroy } from 'svelte'
  import { getChartDrawer } from './context'
  import { newDrawer } from './drawer'
  import { handleMouseIntersection, getDrawingHoverPainter } from './hovered'
  import { handleMouseSelect } from './selectAndDrag'
  import { newAbsoluteToRelativeCoordinatesUpdater } from './coordinates'
  import { newDrawingAxesPainter } from './axes'
  import { getChart } from '../context'

  const chart = getChart()
  const ChartDrawer = getChartDrawer()
  const drawer = newDrawer(chart)

  export let metricKey: string

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

  $: ({ drawings, selectedLine: selected } = $ChartDrawer)
  $: onSelectionChange(selected)
  $: drawer.drawings = drawings
  $: drawer.metricKey = metricKey

  function addDrawing(drawing) {
    $ChartDrawer.drawings = drawings
    drawer.drawings.push(drawing)
    setDrawings(drawer.drawings)
  }

  function onDrawingDelete(drawing: Drawing) {
    ChartDrawer.deleteDrawing(drawing)
  }

  function onDrawingDragEnd(drawing: Drawing, oldAbsCoor: Drawing['absCoor']) {
    ChartDrawer.dispatch({
      type: 'modified',
      data: { drawing, oldAbsCoor },
    })
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

  function selectDrawing(drawing?: Drawing) {
    if (selected === drawing) return
    $ChartDrawer.selectedLine = drawing
    onSelectionChange(drawing)
  }
  function onSelectionChange(drawing?: Drawing) {
    if (drawer.selected === drawing) return
    drawer.selected = drawing

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
    chart.plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
