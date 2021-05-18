const NO_GROUP_ITEMS = [
  { key: 'all', label: 'Recent 100 Insights' },
  { key: 'pro', label: 'PRO Insights', isPro: true },
  { key: 'pulse', label: 'Pulse Insights' },
  { key: 'sanfam', label: 'Sanfam Insights' },
]

const TAG_GROUP_ITEMS = [
  {
    key: 'eth',
    label: 'ETH Insights',
    group: 'Tags',
    checkIsVisible: ({ slug }) => slug !== 'ethereum',
  },
  {
    key: 'btc',
    label: 'BTC Insights',
    group: 'Tags',
    checkIsVisible: ({ slug }) => slug !== 'bitcoin',
  },
  {
    key: 'defi',
    label: 'DEFI Insights',
    group: 'Tags',
  },
]

export function getInsightsGraph(
  project: any,
  hasMyInsights = false,
  hasFollowings = false,
) {
  const { ticker } = project
  const item = {
    key: ticker,
    label: ticker + ' Insights',
    group: 'Tags',
    type: 'project',
  }
  const options = Object.assign({ hasMyInsights, hasFollowings }, project)

  const filter = ({ checkIsVisible }: any) =>
    checkIsVisible ? checkIsVisible(options) : true
  return [...NO_GROUP_ITEMS, item, ...TAG_GROUP_ITEMS].filter(filter)
}
