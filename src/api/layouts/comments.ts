import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'

const LAYOUT_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){commentsCount}
  }
`

type LayoutCommentsCountQuery = SAN.API.Query<'layout', { commentsCount: number }>

const precacher =
  () =>
  ({ layout }: LayoutCommentsCountQuery): number =>
    layout.commentsCount

const options = { precacher }
export const queryLayoutCommentsCount = (id: number): Promise<number> =>
  query(LAYOUT_QUERY(id), options as any) as unknown as Promise<number>

// ------------
// CACHE
// ------------

export const subscribeLayoutCommentsCountCache = (
  id: number,
  clb: SAN.API.Subscriber<any>,
): SAN.API.Unsubscriber => Cache.get$(LAYOUT_QUERY(id), clb)

export const updateLayoutCommentsCountCache = (id: number, commentsCount: number): void =>
  Cache.set$(LAYOUT_QUERY(id), (() => commentsCount) as any)
