export const layoutAccessor = <T>({ layout }: SAN.API.Query<'layout', T>) =>
  layout

export const layoutsAccessor = <T>({ layouts }: SAN.API.Query<'layouts', T>) =>
  layouts

export const currentUserLayoutsAccessor = <T>({
  currentUser,
}: SAN.API.Query<'currentUser', null | { layouts: T }>) =>
  (currentUser?.layouts || []) as T

type Sortable = { updatedAt: string }
export const dateSorter = (
  { updatedAt: a }: Sortable,
  { updatedAt: b }: Sortable,
) => +new Date(b) - +new Date(a)

function dataSorter<T extends Sortable>(data: SAN.API.Query<'layouts', T[]>) {
  data.layouts.sort(dateSorter)
  return data
}
export const sortableLayoutsOptions = { precacher: () => dataSorter }

function currentUserDataSorter<T extends Sortable>(
  data: SAN.API.Query<'currentUser', null | { layouts: T[] }>,
) {
  data.currentUser?.layouts.sort(dateSorter)
  return data
}
export const currentUserSortableLayoutsOptions = {
  precacher: () => currentUserDataSorter,
}
