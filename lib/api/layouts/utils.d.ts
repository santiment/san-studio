/// <reference types="./api" />
export declare const layoutAccessor: <T>({ layout }: SAN.API.Query<'layout', T>) => T
export declare const layoutsAccessor: <T>({ layouts }: SAN.API.Query<'layouts', T>) => T
export declare const currentUserLayoutsAccessor: <T>({
  currentUser,
}: SAN.API.Query<
  'currentUser',
  {
    layouts: T
  } | null
>) => T
declare type Sortable = {
  updatedAt: string
}
export declare const dateSorter: ({ updatedAt: a }: Sortable, { updatedAt: b }: Sortable) => number
declare function dataSorter<T extends Sortable>(
  data: SAN.API.Query<'layouts', T[]>,
): SAN.API.Query<'layouts', T[]>
export declare const sortableLayoutsOptions: {
  precacher: () => typeof dataSorter
}
declare function currentUserDataSorter<T extends Sortable>(
  data: SAN.API.Query<
    'currentUser',
    null | {
      layouts: T[]
    }
  >,
): SAN.API.Query<
  'currentUser',
  {
    layouts: T[]
  } | null
>
export declare const currentUserSortableLayoutsOptions: {
  precacher: () => typeof currentUserDataSorter
}
export {}
