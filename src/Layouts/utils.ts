import type { LayoutCreation } from '@/api/layouts/mutate'
import {
  saveJson,
  getSavedJson,
  saveValue,
  getSavedValue,
  deleteSavedValue,
} from 'webkit/utils/localStorage'
import { RecentType, addRecent, removeRecent } from 'webkit/utils/recents'

type Widget = { metrics?: Studio.Metric[] }

export function getAllWidgetsMetrics(widgets: Widget[]) {
  // @ts-ignore
  return [...new Set(widgets.map(({ metrics }) => metrics).flat())].filter(
    Boolean,
  ) as Studio.Metric[]
}

export const getAllWidgetsMetricsKeys = (widgets: Widget[]) =>
  getAllWidgetsMetrics(widgets).map(({ key }) => key)

const getMetricData = ({ key, queryKey = key }: Studio.Metric, { reqMeta }: Studio.Metric) => ({
  metric: queryKey,
  slug: reqMeta?.slug,
})
export function getLayoutMetrics(widgets: Widget[]) {
  let index = 0
  const metrics = {}

  // NOTE: Backend accepts jsonb map, that's why index is used as a unique key [vanguard, 30 Mar 2022]
  const addMetric = (metric: Studio.Metric) =>
    (metrics[index++] = getMetricData(metric.base || metric, metric))

  getAllWidgetsMetrics(widgets).forEach((metric) => {
    const { baseMetrics } = metric

    if (baseMetrics) {
      return baseMetrics.forEach(addMetric)
    }

    addMetric(metric)
  })
  return metrics
}

const RECENT_LAYOUTS = 'RECENT_TEMPLATES'

function removeRecentLayout(id: number | string) {
  const items = new Set(getSavedRecentLayoutIds())
  items.delete(+id)
  return [...items]
}

const mapSavedRecentLayoutIds = (value: string) => +value
export function getSavedRecentLayoutIds(): number[] {
  const value = getSavedValue(RECENT_LAYOUTS, '')
  return value ? value.split(',').map(mapSavedRecentLayoutIds) : []
}

export function addRecentLayoutId(id: number | string): number[] {
  addRecent(RecentType.CHART_LAYOUT, id)
  return saveRecentLayoutIds([+id, ...removeRecentLayout(id)])
}

export function removeRecentLayoutId(id: number | string): number[] {
  removeRecent(RecentType.CHART_LAYOUT, id)
  return saveRecentLayoutIds(removeRecentLayout(id))
}

function saveRecentLayoutIds(items: number[]) {
  const recents = items.slice(0, 5)
  saveValue(RECENT_LAYOUTS, recents.filter(Boolean).toString())
  return recents
}

const SCHEDULED_CHART = 'SCHEDULED_CHART'
export const saveScheduledLayout = (
  layout: Omit<SAN.Layout, 'id' | 'project' | 'user'>,
): Omit<SAN.Layout, 'id' | 'project' | 'user'> => saveJson(SCHEDULED_CHART, layout)

export const getScheduledLayout = () => getSavedJson(SCHEDULED_CHART) as LayoutCreation

export const deleteScheduledLayout = (): void => deleteSavedValue(SCHEDULED_CHART)
