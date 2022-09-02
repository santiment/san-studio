declare type LayoutUpdates = Partial<Pick<SAN.Layout, 'title' | 'metrics' | 'options'>> & {
  isPublic?: boolean
  projectId?: number | string
  description?: string
  metricsJson?: any
}
export declare const updateUserLayout: (
  id: number,
  settings: LayoutUpdates,
) => Promise<SAN.CurrentUserLayout>
export declare type LayoutCreation = Pick<SAN.Layout, 'title' | 'metrics' | 'options'> & {
  projectId: number | string
  isPublic?: boolean
  description?: string
}
export declare const createUserLayout: (settings: LayoutCreation) => Promise<SAN.CurrentUserLayout>
export declare const DELETE_LAYOUT_MUTATION =
  '\n  mutation ($id: ID!) {\n    deleteChartConfiguration(id: $id) {\n      id\n    }\n  }\n'
export declare const deleteUserLayout: (id: number) => Promise<void>
export {}
