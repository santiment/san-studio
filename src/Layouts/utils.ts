import type { LayoutCreation } from '@/api/layouts/mutate'
import {
  saveJson,
  getSavedJson,
  saveValue,
  getSavedValue,
  deleteSavedValue,
} from 'webkit/utils/localStorage'
import { checkIsDiffObjects } from 'webkit/utils/objects'

type Widget = { metrics?: Studio.Metric[] }

export function getAllWidgetsMetrics(widgets: Widget[]) {
  // @ts-ignore
  return [...new Set(widgets.map(({ metrics }) => metrics).flat())].filter(
    Boolean,
  ) as Studio.Metric[]
}

export const getAllWidgetsMetricsKeys = (widgets: Widget[]) =>
  getAllWidgetsMetrics(widgets).map(({ key }) => key)

const RECENT_LAYOUTS = 'RECENT_TEMPLATES'

function removeRecent(id: number | string) {
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
  return saveRecentLayoutIds([+id, ...removeRecent(id)])
}

export function removeRecentLayoutId(id: number | string): number[] {
  return saveRecentLayoutIds(removeRecent(id))
}

function saveRecentLayoutIds(items: number[]) {
  const recents = items.slice(0, 5)
  saveValue(RECENT_LAYOUTS, recents.filter(Boolean).toString())
  return recents
}

const SCHEDULED_CHART = 'SCHEDULED_CHART'
export const saveScheduledLayout = (
  layout: Omit<SAN.Layout, 'id' | 'project' | 'user'>,
): void => saveJson(SCHEDULED_CHART, layout)

export const getScheduledLayout = () =>
  getSavedJson(SCHEDULED_CHART) as LayoutCreation

export const deleteScheduledLayout = (): void =>
  deleteSavedValue(SCHEDULED_CHART)

export function checkIsDifferentLayouts(
  layoutWidgets: any[],
  widgets: any[],
): boolean {
  const optimizeLayout = window.shareLayoutWidgets
  if (!optimizeLayout) return false

  // Removing undefined values
  const userWidgets: any[] = JSON.parse(JSON.stringify(optimizeLayout(widgets)))

  if (layoutWidgets.length !== userWidgets.length) return true

  for (let i = 0; i < layoutWidgets.length; i++) {
    const layoutWidget = layoutWidgets[i]
    const userWidget = userWidgets[i]

    if (checkIsDiffObjects(layoutWidget, userWidget)) return true
  }

  return false
}
