import { saveValue, getSavedValue } from 'webkit/utils/localStorage'
import { queryShortLayout } from '@/api/layouts'
import { getSavedRecentLayoutIds, removeRecentLayoutId } from '@/Layouts/utils'

export enum Tab {
  MyLibrary = 'My Library',
  Explore = 'Explore',
}
export const TABS = [Tab.MyLibrary, Tab.Explore]

const TICKER = 'TICKER'
export const TICKER_LAYOUTS = TICKER + ' layouts'
export const normalizeCategory = (title: string, ticker: string) => title.replace(TICKER, ticker)

export const newMyLibaryGraph = () => ({
  'Recently viewed': [],
  'My layouts': [],
})

export const newExploreGraph = () => ({
  'Featured by Santiment': [],
  [TICKER_LAYOUTS]: [],
})

const emptyLayoutsFilter = (layouts) => layouts.filter(Boolean)
export function queryRecentLayouts(): Promise<SAN.Layout[]> {
  const ids = getSavedRecentLayoutIds()
  const query = (id: number) =>
    queryShortLayout(id).catch(() => {
      removeRecentLayoutId(id)
      return null
    })

  return ids.length ? Promise.all(ids.map(query)).then(emptyLayoutsFilter) : Promise.resolve([])
}

const HAS_OPENED_MY_LIBRARY = 'HAS_OPENED_MY_LIBRARY'
export const checkHasOpenedMyLibrary = () => !!getSavedValue(HAS_OPENED_MY_LIBRARY)
export const saveHasOpenedMyLibrary = () => saveValue(HAS_OPENED_MY_LIBRARY, '+')
