const NO_GROUP_ITEMS = [
  { key: 'all', label: 'Recent 100 Insights' },
  { key: 'pro', label: 'PRO Insights', isPro: true },
  { key: 'pulse', label: 'Pulse Insights' },
  { key: 'sanfam', label: 'Sanfam Insights' },
  {
    key: 'my',
    label: 'My Insights',
    checkIsVisible: ({ hasMyInsights }) => hasMyInsights,
  },
  {
    key: 'followings',
    label: 'My Followings',
    checkIsVisible: ({ hasFollowings }) => hasFollowings,
  },
]

const TAG_GROUP_ITEMS = [
  {
    key: 'eth',
    label: 'ETH Insights',
    group: 'Tags',
    checkIsVisible: ({ ticker }) => ticker !== 'ETH',
  },
  {
    key: 'btc',
    label: 'BTC Insights',
    group: 'Tags',
    checkIsVisible: ({ ticker }) => ticker !== 'BTC',
  },
  {
    key: 'defi',
    label: 'DEFI Insights',
    group: 'Tags',
  },
]

export function getInsightsGraph(
  ticker: string,
  hasMyInsights = false,
  hasFollowings = false,
) {
  const item = {
    key: ticker,
    label: ticker + ' Insights',
    group: 'Tags',
    type: 'project',
  }
  const options = { hasMyInsights, hasFollowings, ticker }

  const filter = ({ checkIsVisible }: any) =>
    checkIsVisible ? checkIsVisible(options) : true

  const insights = [...NO_GROUP_ITEMS, item, ...TAG_GROUP_ITEMS].filter(filter)
  return { insights, projectInsight: item }
}
