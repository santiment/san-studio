declare namespace SAN {
  type Layout = {
    id: number
    title: string
    description: string
    metrics: string[]
    options: { widgets?: { [key: string]: any }[] }
    project: SAN.Project
    user: SAN.Author
    isPublic: boolean
  }

  type ShortLayout = Pick<Layout, 'id' | 'title'>

  type SortedShortLayout = ShortLayout & { updatedAt: string }
  type ProjectLayout = Layout & SortedShortLayout & { isPublic: boolean }

  type CurrentUserLayout = ProjectLayout
}
