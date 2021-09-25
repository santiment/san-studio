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

  // $: ({ drawings } = $ChartDrawer)

  $: drawings = [
    {
      type: 'sticker',
      id: 'rocket',
      size: 50,
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
    chart.plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
