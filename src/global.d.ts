/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface Process {
    browser: boolean
    GQL_SERVER_URL: string
  }
}

interface Window {
  showLoginPrompt?: () => void
  shareLayoutWidgets?: (widgets: any[]) => any[]
  parseLayoutWidgets: (layout: import('@/api/layouts').Layout) => any[]
  onLayoutSelect: (layout: import('@/api/layouts').Layout) => void
  notifyLayoutSave?: () => void
  notifyLayoutEdit?: () => void
  notifyLayoutCreation?: () => void
  renderCombineProjectSelector?: () => void
}

type ChartNode = import('@/Chart/nodes').ChartNode

namespace Studio {
  type Project = { slug: string; ticker: string }

  type Settings = import('@/stores/studio').StudioSettings

  type Metric = {
    key: string
    label: string
    shorthand?: string
    category: import('@/metrics/graph').MetricCategory
    group?: string
    queryKey?: string
    node: ChartNode[keyof ChartNode]
    formatter?: (...args: any[]) => any
    axisFormatter?: (...args: any[]) => any
    checkIsVisible?: (...args: any[]) => any
    getLabel?: (ticker: string) => string
    reqMeta?: { [key: string]: any }
    indicator?: any
    base?: any
    project?: Project
    selector?: string
    selectorType?: import('@/metrics/selector/types').SelectorType
    domainGroup?: string
    type?: string
    noProject?: boolean
  }

  type Widget = {
    metrics: Studio.Metric[]
  }

  export type SelectorNode =
    | {
        key: string
        label: string
        category: string
        group?: string
        shorthand?: string
        selectorType?: import('@/metrics/selector/types').SelectorType
        checkIsVisible?: (options: { [key: string]: any }) => boolean
      }
    | Studio.Metric

  type ChartWidget = import('@/ChartWidget/context').ChartWidget

  type Chart = import('@/Chart/context').Chart

  type HolderDistributionMetric = Metric & {
    baseMetrics: any[]
  }

  type MetricSetting =
    import('@/ChartWidget/MetricSettings/context').MetricSetting

  type MetricSettings =
    import('@/ChartWidget/MetricSettings/context').MetricSettings
}

declare module 'mathjs/lib/esm/number' {
  export const create = import('mathjs').create
  export const all = import('mathjs').all
}
