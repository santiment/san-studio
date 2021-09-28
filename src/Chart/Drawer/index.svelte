<svelte:options immutable />

<script lang="ts">
  import type { Drawing } from './drawer'
  import { onDestroy } from 'svelte'
  import { getChartDrawer } from './context'
  import { newDrawer } from './drawer'
  import { newMouseHoverHandler, getDrawingHoverPainter } from './hovered'
  import {
    newMouseSelectHandler,
    newDrawingDeleteHandler,
  } from './selectAndDrag'
  import { newDrawingAxesPainter } from './axes'
  import { newLineCreationHandler } from './newLine'
  import { hook } from './utils'
  import { getChart } from '../context'

  const chart = getChart()
  const ChartDrawer = getChartDrawer()
  const drawer = newDrawer(chart, onSelectionChange)

  export let metricKey: string

  let selected: Drawing | undefined
  let isNewDrawing = false

  const drawingDeleteHandler = newDrawingDeleteHandler(drawer)
  const drawingHoverHandler = newMouseHoverHandler(chart, setHovered)
  const lineCreationHandler = newLineCreationHandler(
    chart,
    onNewDrawingStart,
    onNewDrawingEnd,
  )
  const drawingSelectHandler = newMouseSelectHandler(chart, {
    selectDrawing,
    startDrawing,
    stopDrawing,
    onDrawingDragEnd,
  })
  const deleteDrawer = ChartDrawer.addDrawer(drawer)

  drawer.drawings = $ChartDrawer.drawings
  drawer.addDrawing = addDrawing
  drawer.deleteDrawing = deleteDrawing

  $: onSelectionChange(selected)
  $: drawer.metricKey = metricKey
  $: cleanup = hookDrawer(isNewDrawing)

  const unsubscribeStore = ChartDrawer.subscribe((store) => {
    selected = store.selectedLine
    isNewDrawing = store.isNewDrawing
  })

  function addDrawing(drawing: Drawing) {
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
    ChartDrawer.setIsDrawing((chart.isDrawing = value))
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
        hoverPainter(chart, drawing)
        drawingAxesPainter()
      }

      window.addEventListener('keydown', drawingDeleteHandler)
    } else {
      drawer.drawSelection = undefined
      window.removeEventListener('keydown', drawingDeleteHandler)
    }
  }

  function onNewDrawingStart(drawing: Drawing) {
    ChartDrawer.addDrawing(drawing)
    selectDrawing(drawing)
    startDrawing()
  }

  function onNewDrawingEnd(drawing: Drawing) {
    stopDrawing()
    ChartDrawer.dispatch({
      type: 'new line',
      data: drawing,
    })
  }

  function hookDrawer(isNewDrawing: boolean) {
    if (cleanup) cleanup()
    const parent = chart.canvas.parentNode as HTMLElement

    if (isNewDrawing) {
      return hook(parent, 'mousedown', lineCreationHandler)
    }

    const removeDrawingHoverHandler = hook(
      parent,
      'mousemove',
      drawingHoverHandler,
    )
    const removeDrawingSelectHandler = hook(
      parent,
      'mousedown',
      drawingSelectHandler,
    )

    return () => {
      removeDrawingHoverHandler()
      removeDrawingSelectHandler()
    }
  }

  onDestroy(() => {
    unsubscribeStore()
    cleanup()
    deleteDrawer()
    chart.plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
