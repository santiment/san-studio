/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface Process {
    browser: boolean
    GQL_SERVER_URL: string
  }
}

type ChartNode = import('@/Chart/nodes').ChartNode

namespace Studio {
  type Project = { slug: string; ticker: string }

  type Metric = {
    key: string
    label: string
    shorthand?: string
    category: import('@/metrics/graph').MetricCategory
    group?: string
    queryKey?: string
    node: ChartNode[keyof ChartNode]
    formatter?: (...args: any[]) => any
    checkIsVisible?: (...args: any[]) => any
    getLabel?: (ticker: string) => string
    reqMeta?: { [key: string]: any }
    indicator?: any
    base?: any
    project?: Project
    selectorType?: import('@/metrics/selector/types').SelectorType
    domainGroup?: string
    type?: string
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
}
