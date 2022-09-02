export declare const LAYOUT_QUERY_FIELDS =
  'id\n\t\t\ttitle\n\t\t\toptions\n\t\t\tmetrics\n      description\n\t\t\tproject {\n        projectId: id\n\t\t\t\tname\n\t\t\t\tslug\n\t\t\t\tticker\n\t\t\t}\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\temail\n\t\t\t\tavatarUrl\n\t\t\t}'
export declare const queryLayout: (id: number) => Promise<SAN.Layout>
export declare const updateLayoutCache: (layout: SAN.Layout) => void
export declare const queryShortLayout: (id: number) => Promise<SAN.ShortLayout>
