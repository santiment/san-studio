type Widget = { metrics?: Studio.Metric[] }

export function getAllWidgetsMetrics(widgets: Widget[]) {
  // @ts-ignore
  return [...new Set(widgets.map(({ metrics }) => metrics).flat())].filter(
    Boolean,
  ) as Studio.Metric[]
}

export const getAllWidgetsMetricsKeys = (widgets: Widget[]) =>
  getAllWidgetsMetrics(widgets).map(({ key }) => key)
