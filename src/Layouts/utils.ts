import { saveValue, getSavedValue } from 'webkit/utils/localStorage'

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
