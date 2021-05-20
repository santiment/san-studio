import {
  Metric,
  MvrvTimebounds,
  MvrvUsdIntradayTimebounds,
  RealizedCapTimebounds,
} from '@/metrics'
import { SelectorType } from './types'
import { SelectorNode } from './index'

SelectorNode.spent_coin_cost = {
  key: 'spent_coin_cost',
  label: 'Spent Coin Cost',
  selectorType: SelectorType.Sidewidget,
  checkIsActive: (sidewidget) => sidewidget === SelectorNode.spent_coin_cost,
}

SelectorNode.SOCIAL_CONTEXT = {
  key: 'SOCIAL_CONTEXT',
  label: 'Social Context',
  selectorType: SelectorType.Sidewidget,
  checkIsActive: (sidewidget) => sidewidget === SelectorNode.SOCIAL_CONTEXT,
}

SelectorNode.TopTransactionsTable = {
  key: 'TopTransactionsTable',
  label: 'Top Transactions Table',
  group: 'Network Activity',
  shorthand: 'ttt',
  selectorType: SelectorType.Subwidget,
}
export const Subitems = {
  [Metric.price_usd.key]: [SelectorNode.spent_coin_cost],

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
