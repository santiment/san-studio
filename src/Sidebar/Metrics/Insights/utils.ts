import { checkIsFilterMatch } from '@/metrics/selector/utils'

const NO_GROUP_ITEMS = [
  { key: 'all', label: 'Recent 100 Insights' },
  { key: 'pulse', label: 'Pulse Insights' },
  { key: 'sanfam', label: 'Sanfam Insights' },
]

const TAG_GROUP_ITEMS = [
  {
    key: 'ETH',
    label: 'ETH Insights',
    group: 'Tags',
    checkIsVisible: ({ ticker }) => ticker !== 'ETH',
  },
  {
    key: 'BTC',
    label: 'BTC Insights',
    group: 'Tags',
    checkIsVisible: ({ ticker }) => ticker !== 'BTC',
  },
  {
    key: 'DEFI',
    label: 'DEFI Insights',
    group: 'Tags',
  },
  { key: 'pro', label: 'PRO Insights', isPro: true, group: 'Tags' },
  {
    key: 'my',
    label: 'My Insights',
    group: 'Tags',
    checkIsVisible: ({ hasMyInsights }) => hasMyInsights,
  },
  {
    key: 'followings',
    label: 'My Followings',
    group: 'Tags',
    checkIsVisible: ({ hasFollowings }) => hasFollowings,
  },
]

export function getInsightsGraph(
  ticker: string,
  hasMyInsights = false,
  hasFollowings = false,
  searchTerm = '',
) {
  const item = {
    key: ticker,
    label: ticker + ' Insights',
    group: 'Tags',
    type: 'project',
  }
  const options = { hasMyInsights, hasFollowings, ticker }

  const filter = (item: any) => {
    const isVisible = item.checkIsVisible?.(options) ?? true
    return (
      isVisible && (searchTerm ? checkIsFilterMatch(searchTerm, item) : true)
    )
  }

  const insights = NO_GROUP_ITEMS.concat(item, TAG_GROUP_ITEMS).filter(filter)
  return { insights, projectInsight: item }
}
