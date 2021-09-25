<svelte:options immutable />

<script lang="ts">
  import type { Drawing } from './drawer'
  import { onDestroy } from 'svelte'
  import { getChartDrawer } from './context'
  import { newDrawer } from './drawer'
  import { handleMouseIntersection, getDrawingHoverPainter } from './hovered'
  import { handleMouseSelect, newDrawingDeleteHandler } from './selectAndDrag'
  import { newAbsoluteToRelativeCoordinatesUpdater } from './coordinates'
  import { newDrawingAxesPainter } from './axes'
  import { getChart } from '../context'

  const chart = getChart()
  const ChartDrawer = getChartDrawer()
  const drawer = newDrawer(chart)

  const onDrawingDelete = newDrawingDeleteHandler(drawer)
  const removeMouseIntersectionHandler = handleMouseIntersection(
    chart,
    setHovered,
  )

  export let metricKey: string

  let selected: Drawing | undefined
  let isAwaitingRedraw = false

  handleMouseSelect(chart, {
    selectDrawing,
    startDrawing,
    stopDrawing,
    onDrawingDragEnd,
  })
  drawer.addDrawing = addDrawing
  drawer.deleteDrawing = deleteDrawing

  $: onSelectionChange(selected)
  $: drawer.drawings = $ChartDrawer.drawings
  $: drawer.metricKey = metricKey
  $: console.log(selected)
  $: if (isAwaitingRedraw) {
    drawer.redraw()
    isAwaitingRedraw = false
  }

  const unsubscribeStore = ChartDrawer.subscribe((store) => {
    selected = store.selectedLine

    if (store.isAwaitingRedraw) {
      store.isAwaitingRedraw = false
      isAwaitingRedraw = true
    }
  })

  function addDrawing(drawing) {
    ChartDrawer.addDrawing(drawing)
    ChartDrawer.dispatch({
      type: 'new line',
      data: drawing,
    })
  }

  function deleteDrawing(drawing: Drawing) {
    ChartDrawer.deleteDrawing(drawing)
    ChartDrawer.dispatch({
      type: 'delete',
      data: drawing,
    })
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
    if (drawer.selected === drawing) return
    ChartDrawer.selectDrawing(drawing)
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
      window.addEventListener('keydown', onDrawingDelete)
    } else {
      drawer.drawSelection = undefined
      drawer.updateSelectionCoordinates = undefined
      window.removeEventListener('keydown', onDrawingDelete)
    }
  }

  onDestroy(() => {
    unsubscribeStore()
    chart.plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
