import type { Layout } from '@/api/layouts'
import { getSavedValue } from 'webkit/utils/localStorage'
import { queryShortLayout } from '@/api/layouts'

export enum Tab {
  MyLibrary = 'My Library',
  Explore = 'Explore',
}
export const TABS = [Tab.MyLibrary, Tab.Explore]

const TICKER = 'TICKER'
export const TICKER_LAYOUTS = TICKER + ' layouts'
export const normalizeCategory = (title: string, ticker: string) =>
  title.replace(TICKER, ticker)

export const newMyLibaryGraph = () => ({
  'Recently viewed': [],
  'My layouts': [],
})

export const newExploreGraph = () => ({
  'Featured by Santiment': [],
  [TICKER_LAYOUTS]: [],
})

const RECENT_LAYOUTS = 'RECENT_TEMPLATES'

const mapSavedRecentLayoutIds = (value: string) => +value
function getSavedRecentLayoutIds(): number[] {
  const value = getSavedValue(RECENT_LAYOUTS, '')
  return value ? value.split(',').map(mapSavedRecentLayoutIds) : []
}

const emptyLayoutsFilter = (layouts) => layouts.filter(Boolean)
export function queryRecentLayouts(): Promise<Layout[]> {
  const ids = getSavedRecentLayoutIds()
  const query = (id: number) => queryShortLayout(id).catch(() => null)
  return ids.length
    ? Promise.all(ids.map(query)).then(emptyLayoutsFilter)
    : Promise.resolve([])
}
