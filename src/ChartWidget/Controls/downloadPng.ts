import { initChart, updateChartState } from 'san-chart'
import { getTimeFormats, getDateFormats } from 'webkit/utils/dates'
import { getPadding } from '@/Chart/Axes/utils'

const LINE_WIDTH = 2
const relativeToAbsoluteCoordinates = () => []

const LEGEND_RECT_SIZE = 9
const LEGEND_RECT_RIGHT_MARGIN = 5
const TEXT_RIGHT_MARGIN = 20
const LEGEND_FONT = '15px Proxima Nova'

const PNG_WIDTH = 1920
const PNG_HEIGHT = 650

function drawAndMeasureText(pngCtx, text, x, y) {
  pngCtx.fillText(text, x, y)
  return pngCtx.measureText(text).width
}

function getLabel(metric, ticker) {
  const { project, label } = metric
  if (project) return label
  return metric.getLabel?.(ticker) || `${label} (${ticker})`
}

function drawLegend(pngChart, metrics, textColor, ticker: string) {
  const { canvasWidth: width, canvasHeight: height, colors } = pngChart
  const pngCtx = pngChart.ctx
  pngCtx.font = LEGEND_FONT

  const textWidth =
    metrics.reduce(
      (acc, metric) =>
        acc +
        LEGEND_RECT_SIZE +
        LEGEND_RECT_RIGHT_MARGIN +
        pngCtx.measureText(getLabel(metric, ticker)).width,
      0,
    ) +
    TEXT_RIGHT_MARGIN * (metrics.length - 1)

  const textY = height - 20
  let textX = (width - textWidth) / 2

  metrics.forEach((metric) => {
    pngCtx.fillStyle = colors[metric.key]
    pngCtx.fillRect(
      textX,
      textY - LEGEND_RECT_SIZE,
      LEGEND_RECT_SIZE,
      LEGEND_RECT_SIZE,
    )

    pngCtx.textAlign = 'left'
    pngCtx.textBaseline = 'alphabetic'
    pngCtx.fillStyle = textColor
    textX += LEGEND_RECT_SIZE + LEGEND_RECT_RIGHT_MARGIN
    textX +=
      drawAndMeasureText(pngCtx, getLabel(metric, ticker), textX, textY) +
      TEXT_RIGHT_MARGIN
  })
}

function paintDrawings(chart) {
  const { ctx, drawer } = chart
  const { drawings } = drawer

  for (let i = 0, len = drawings.length; i < len; i++) {
    const drawing = drawings[i]
    const absCoor = relativeToAbsoluteCoordinates(chart, drawing)
    if (!absCoor.length) continue

    const [x1, y1, x2, y2] = absCoor
    const { color, width = LINE_WIDTH } = drawing
    const shape = new Path2D()

    ctx.lineWidth = width
    ctx.strokeStyle = color

    shape.moveTo(x1, y1)
    shape.lineTo(x2, y2)
    ctx.stroke(shape)
  }
}

export function downloadPng(
  widget: Studio.ChartWidget,
  { slug, name = slug, ticker },
) {
  const { chart } = widget
  const { data, categories, scale, colors, theme } = chart
  const { domainModifier, domainGroups } = chart
  const padding = getPadding(chart, chart.axesMetricKeys)

  const dpr = window.devicePixelRatio || 1
  ;(window as any).devicePixelRatio = 2

  const pngCanvas = document.createElement('canvas')
  // prettier-ignore
  const pngChart = Object.assign(
    {}, chart, initChart(pngCanvas, PNG_WIDTH, PNG_HEIGHT, padding),
  ) as any

  ;(window as any).devicePixelRatio = dpr

  updateChartState(
    pngChart,
    data,
    categories.joinedCategories,
    domainModifier,
    domainGroups,
    new Set(categories.candles) as any,
  )

  chart.plotManager.items.forEach((plot) => {
    plot(pngChart, scale, data, colors, categories)
  })

  drawLegend(pngChart, widget.Metrics.getValue(), chart.theme.text, ticker)
  paintDrawings(pngChart)

  pngChart.ctx.globalCompositeOperation = 'destination-over'
  pngChart.ctx.fillStyle = chart.theme.bg
  pngChart.ctx.fillRect(0, 0, PNG_WIDTH, PNG_HEIGHT)

  const a = document.createElement('a')
  const date = new Date()
  const { DD, MMM, YYYY } = getDateFormats(date)
  const { HH, mm, ss } = getTimeFormats(date)
  const title = `${name} (${ticker})`
  a.download = `${title} [${HH}.${mm}.${ss}, ${DD} ${MMM}, ${YYYY}].png`
  a.href = pngCanvas.toDataURL('image/png', 1)
  a.click()
  a.remove()
  pngCanvas.remove()
}
