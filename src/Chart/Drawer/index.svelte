<script lang="ts">
  import { newCanvas } from 'san-chart'
  import {
    paintDrawings,
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
  import { onDestroy } from 'svelte'
  const chart = getChart()
  const ChartDrawer = getChartDrawer()

  export let metricKey: string
  export let axesMetricKeys: string[]

  const { canvas, plotManager } = chart
  const drawer = newCanvas(chart)
  const { parentNode, nextElementSibling } = canvas

  parentNode.insertBefore(drawer.canvas, nextElementSibling || canvas)
  drawer.onLineHover = handleLineHover(chart)
  drawer.onLineMouseDown = handleLineMouseDown(
    chart,
    selectLine,
    setIsDrawing,
    setDrawings,
  )
  drawer.redraw = redraw
  drawer.recalcAbsCoor = recalcAbsCoor
  drawer.dispatch = ChartDrawer.dispatch
  drawer.deleteDrawing = deleteDrawing
  drawer.addDrawing = addDrawing
  chart.drawer = drawer
  plotManager.set('Drawer', drawer.recalcAbsCoor)

  $: ({ drawings } = $ChartDrawer)
  $: drawer.drawings = drawings
  $: axesMetricKeys && recalcAbsCoor()
  $: chart.drawingKey = metricKey
  $: ({ isNewDrawing } = $ChartDrawer)
  $: recalcRelCoor(metricKey)
  $: cleanup = hookDrawer(isNewDrawing)

  function redraw() {
    paintDrawings(chart)
    paintDrawingAxes(chart)
  }

  function selectLine(line) {
    $ChartDrawer.selectedLine = line
  }

  function setIsDrawing(value: boolean) {
    chart.isDrawing = value
    $ChartDrawer.isDrawing = value
  }

  function setIsNewDrawing(value: boolean) {
    if ($ChartDrawer.isNewDrawing === value) return
    $ChartDrawer.isNewDrawing = value
  }

  function setDrawings(drawings: any[]) {
    $ChartDrawer.drawings = drawings
  }

  function recalcAbsCoor() {
    if (!chart.minMaxes || !chart.minMaxes[metricKey]) return

    drawer.drawings.forEach((drawing) => {
      if (drawing.relCoor) {
        drawing.absCoor = relativeToAbsoluteCoordinates(chart, drawing)
      }
    })
    drawer.redraw()
  }

  function recalcRelCoor(metricKey: string) {
    if (!chart.minMaxes || !chart.minMaxes[metricKey]) return

    drawer.drawings.forEach((drawing) => {
      if (drawing.relCoor) {
        drawing.relCoor = absoluteToRelativeCoordinates(chart, drawing)
      }
    })
    drawer.redraw()
  }

  function hookDrawer(isNewDrawing: boolean) {
    if (cleanup) cleanup()
    const parent = chart.canvas.parentNode
    const { onLineHover, onLineMouseDown } = chart.drawer

    if (isNewDrawing) {
      return handleLineCreation(
        chart,
        selectLine,
        setIsDrawing,
        setIsNewDrawing,
        setDrawings,
      )
    }

    parent.addEventListener('mousemove', onLineHover)
    parent.addEventListener('mousedown', onLineMouseDown)
    return () => {
      parent.removeEventListener('mousemove', onLineHover)
      parent.removeEventListener('mousedown', onLineMouseDown)
    }
  }

  function addDrawing(drawing) {
    drawer.drawings.push(drawing)
    setDrawings(drawer.drawings)
  }

  function deleteDrawing(drawing) {
    drawer.selected = null
    drawer.drawings = drawer.drawings.filter((d) => d !== drawing)
    setDrawings(drawer.drawings)
    selectLine()
    setIsDrawing(false)
    drawer.redraw()
  }

  onDestroy(() => {
    plotManager.delete('Drawer')
    drawer.canvas.remove()
    delete chart.drawer
  })
</script>
