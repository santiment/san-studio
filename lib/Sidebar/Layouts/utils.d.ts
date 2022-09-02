export declare enum Tab {
  MyLibrary = 'My Library',
  Explore = 'Explore',
}
export declare const TABS: Tab[]
export declare const TICKER_LAYOUTS: string
export declare const normalizeCategory: (title: string, ticker: string) => string
export declare const newMyLibaryGraph: () => {
  'Recently viewed': never[]
  'My layouts': never[]
}
export declare const newExploreGraph: () => {
  [x: string]: never[]
  'Featured by Santiment': never[]
}
export declare function queryRecentLayouts(): Promise<SAN.Layout[]>
export declare const checkHasOpenedMyLibrary: () => boolean
export declare const saveHasOpenedMyLibrary: () => void
