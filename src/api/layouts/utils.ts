import type { Query } from 'webkit/api'

export const layoutAccessor = <T>({ layout }: Query<'layout', T>) => layout
export const layoutsAccessor = <T>({ layouts }: Query<'layouts', T>) => layouts
export const currentUserLayoutsAccessor = <T>({
  currentUser,
}: Query<'currentUser', null | { layouts: T }>) =>
  (currentUser?.layouts || []) as T

type Sortable = { updatedAt: string }
export const dateSorter = (
  { updatedAt: a }: Sortable,
  { updatedAt: b }: Sortable,
) => +new Date(b) - +new Date(a)

function dataSorter<T extends Sortable>(data: Query<'layouts', T[]>) {
  data.layouts.sort(dateSorter)
  return data
}
export const sortableLayoutsOptions = { precacher: () => dataSorter }

function currentUserDataSorter<T extends Sortable>(
  data: Query<'currentUser', null | { layouts: T[] }>,
) {
  data.currentUser?.layouts.sort(dateSorter)
  return data
}
export const currentUserSortableLayoutsOptions = {
  precacher: () => currentUserDataSorter,
}
