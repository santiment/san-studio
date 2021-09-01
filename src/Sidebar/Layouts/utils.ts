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
  'Recently viewed': [
    { id: 0, title: 'ETH layout' },
    { id: 1, title: 'Cool layout' },
  ],
  'My layouts': [],
})

export const newExploreGraph = () => ({
  'Featured by Santiment': [],
  [TICKER_LAYOUTS]: [],
})
