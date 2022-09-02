export declare function getInsightsGraph(
  ticker: string,
  hasMyInsights?: boolean,
  hasFollowings?: boolean,
  searchTerm?: string,
): {
  insights: {
    key: string
    label: string
  }[]
  projectInsight: {
    key: string
    label: string
    group: string
    type: string
  }
}
