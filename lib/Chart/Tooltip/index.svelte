<svelte:options immutable />

<script lang="ts">
  import { onDestroy } from 'svelte'
  import {
    initTooltip,
    drawTooltip,
    drawHoverLineX,
    drawHoverLineY,
    drawValueBubbleX,
    drawValueBubbleY,
    getTootlipTotalWidth,
  } from '@santiment-network/chart/tooltip'
  import { handleMove as handlePointEvent } from '@santiment-network/chart/events'
  import { logScale, valueByY, valueByLogY } from '@santiment-network/chart/scales'
  import { NotableSignal } from './../../metrics/_notables'
  import { getTooltipSynchronizer } from './context'
  import { onSelection } from './selection'
  import { clearCtx, getDateDayMonthYear } from '../utils'
  import { getChart } from '../context'
  import { getMetricAxisFormatter, MULTI_AXIS_WIDTH } from '../Axes/utils'

  export let axesMetricKeys = [] as any
  export let metricSettings: any
  export let onPointClick = null as any
  export let onRangeSelect = null as any
  export let isShiftForced = false
  export let leftPadding = 0

  const tooltipSynchronizer = getTooltipSynchronizer()
  const chart = getChart()
  const { tooltip } = initTooltip(chart)
  const { canvas, ctx } = tooltip
  canvas.style.userSelect = 'none'

  chart.drawTooltip = (point, y: number) => plotTooltip(chart, point, y)
  if (tooltipSynchronizer) tooltipSynchronizer.add(chart)

  let xOffset = 0

  $: chart.tooltipKey = axesMetricKeys[0]

  onSelection(chart, canvas, onPointClick, onRangeSelect)
  canvas.ontouchend = canvas.onmouseleave = () => {
    if (!chart.drawSelection) clearCtx(chart, ctx)
    if (tooltipSynchronizer) tooltipSynchronizer.sync(chart)

    document.body.classList.remove('$style.hovering')
  }

  canvas.ontouchstart =
    canvas.ontouchmove =
    canvas.onmousemove =
      handlePointEvent(chart, (point, e) => {
        if (!point) return
        const isMouveEvent = e instanceof MouseEvent

        if (isMouveEvent === false) {
          if (document.body.classList.contains('$style.hovering') === false) {
            document.body.classList.add('$style.hovering')
          }
        }

        const { top, bottom } = chart
        const offsetY = isMouveEvent ? e.offsetY : e.changedTouches[0].clientY
        const y = offsetY < top ? top : offsetY > bottom ? bottom : offsetY

        plotTooltip(chart, point, y, e.shiftKey)
        if (tooltipSynchronizer) tooltipSynchronizer.sync(chart, point.value, y)
      })

  function marker(ctx, key, value, x, y) {
    const { colors } = chart
    const RADIUS = 4

    if (metricSettings[key]?.marker) {
      return metricSettings[key].marker(ctx, key, value, x, y)
    }

    if (NotableSignal[key]) {
      ctx.beginPath()
      ctx.arc(x + RADIUS, y + 1, RADIUS, 0, 2 * Math.PI)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#FF5B5B'
      ctx.stroke()
      return
    }

    ctx.fillStyle = colors[key]
    ctx.fillRect(x, y, 8, 2)
  }

  function plotTooltip(chart, point, y: number, shiftKey?: boolean) {
    clearCtx(chart, ctx)
    const { theme, scale, minMaxes, rightAxisMargin } = chart
    const { x, value: datetime } = point

    const selectionPoint = chart.drawSelection?.(x, y, point)
    const oldPoint = (shiftKey || isShiftForced) && selectionPoint

    drawHoverLineX(chart, x, theme.hoverLine, 5)
    drawHoverLineY(chart, y, theme.hoverLine, 0, rightAxisMargin)

    const xValueFormatted = getDateDayMonthYear(datetime)
    drawValueBubbleX(chart, ctx, xValueFormatted, x, theme.bubbles)

    const isLogScale = scale === logScale
    let offset = rightAxisMargin
    axesMetricKeys.forEach((metricKey) => {
      const minMax = minMaxes[metricKey]
      if (!minMax) return
      const { min, max } = minMax
      const valueScaler = isLogScale ? valueByLogY : valueByY
      const formatter = getMetricAxisFormatter(metricSettings, metricKey)
      const value = formatter(valueScaler(chart, y, min, max))

      drawValueBubbleY(chart, ctx, value, y, theme.bubbles, offset)

      offset += MULTI_AXIS_WIDTH
    })

    if (xOffset) {
      if (x > xOffset) xOffset = leftPadding
    } else {
      const tooltipWidth =
        // prettier-ignore
        getTootlipTotalWidth(ctx, point, metricSettings, theme.tooltip.font, oldPoint) +
        10

      xOffset = x < tooltipWidth ? tooltipWidth : 0
    }

    drawTooltip(
      ctx,
      chart.modifyPoint?.(point, x, y) || point,
      metricSettings,
      marker,
      theme.tooltip,
      xOffset,
      0,
      oldPoint,
    )
  }

  onDestroy(() => {
    if (tooltipSynchronizer) tooltipSynchronizer.delete(chart)
    if (process.browser) {
      document.body.classList.remove('$style.hovering')
    }
  })
</script>

<style>
  .hovering {
    overflow: hidden !important;
  }
</style>
