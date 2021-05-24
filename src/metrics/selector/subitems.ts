import {
  Metric,
  MvrvTimebounds,
  MvrvUsdIntradayTimebounds,
  RealizedCapTimebounds,
  CirculationTimebounds,
  DormantCirculationTimebounds,
} from '@/metrics'
import { SelectorType } from './types'
import { SelectorNode } from './index'

SelectorNode.SPENT_COIN_COST = {
  key: 'SPENT_COIN_COST',
  label: 'Spent Coin Cost',
  selectorType: SelectorType.Sidewidget,
  checkIsActive: (sidewidget) => sidewidget === SelectorNode.SPENT_COIN_COST,
}

SelectorNode.SOCIAL_CONTEXT = {
  key: 'SOCIAL_CONTEXT',
  label: 'Social Context',
  selectorType: SelectorType.Sidewidget,
  checkIsActive: (sidewidget) => sidewidget === SelectorNode.SOCIAL_CONTEXT,
}

SelectorNode.FeesDistribution = {
  key: 'FeesDistribution',
  label: 'Fees Distribution',
  selectorType: SelectorType.Widget,
  checkIsVisible: ({ slug }) => slug === 'ethereum',
}

SelectorNode.HoldersDistributionTable = {
  key: 'HoldersDistributionTable',
  label: 'Top Holders Table',
  group: 'Whales',
  selectorType: SelectorType.Widget,
}

SelectorNode.TopTransactionsTable = {
  key: 'TopTransactionsTable',
  label: 'Top Transactions Table',
  group: 'Network Activity',
  shorthand: 'ttt',
  selectorType: SelectorType.Subwidget,
}
export const Subitems = {
  [Metric.price_usd.key]: [SelectorNode.SPENT_COIN_COST],

  [Metric.social_volume_total.key]: [
    SelectorNode.SOCIAL_CONTEXT,
    Metric.social_active_users_telegram,
    Metric.social_active_users_twitter,
  ],

  [Metric.twitter_followers.key]: [
    Metric.twitter_followers_24h,
    Metric.twitter_followers_7d,
  ],
  [Metric.mvrv_usd.key]: Object.values(MvrvTimebounds),
  [Metric.mvrv_usd_intraday.key]: Object.values(MvrvUsdIntradayTimebounds),
  [Metric.realized_value_usd.key]: Object.values(RealizedCapTimebounds),
  [Metric.circulation.key]: Object.values(CirculationTimebounds),
  [Metric.dormant_circulation_365d.key]: Object.values(
    DormantCirculationTimebounds,
  ),

  [Metric.median_fees_usd.key]: [SelectorNode.FeesDistribution],
  [Metric.amount_in_top_holders.key]: [SelectorNode.HoldersDistributionTable],

  [Metric.transaction_volume.key]: [SelectorNode.TopTransactionsTable],
}

export const IsSubitem = {}
for (let key in Subitems) {
  const subitems = Subitems[key]
  for (let i = 0; i < subitems.length; i++) {
    const item = subitems[i] as any
    item.submetricOf = Metric[key]
    IsSubitem[item.key] = true
  }
}
