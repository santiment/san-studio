import { initChart, updateChartState } from 'san-chart'
import { getTimeFormats, getDateFormats } from 'webkit/utils/dates'
import { getPadding } from '@/Chart/Axes/utils'

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
  const pngChart = initChart(pngCanvas, PNG_WIDTH, PNG_HEIGHT, padding) as any
  ;(window as any).devicePixelRatio = dpr

  pngChart.scale = scale
  pngChart.axesMetricKeys = chart.axesMetricKeys
  pngChart.rightAxisMargin = chart.rightAxisMargin
  pngChart.domainGroups = domainGroups
  pngChart.colors = colors
  pngChart.theme = theme

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
