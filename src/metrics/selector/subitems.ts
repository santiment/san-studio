import {
  Metric,
  MvrvTimebounds,
  MvrvUsdIntradayTimebounds,
  RealizedCapTimebounds,
  CirculationTimebounds,
  DormantCirculationTimebounds,
  MeanAgeTimebounds,
  MeanDollarInvestedAgeTimebounds,
  Eth2StakersRealizedTimebounds,
  Eth2StakersMvrvTimebounds,
  RealizedCapHodlWavesTimebounds,
  SpentCoinsAgeBandTimebounds,
} from '@/metrics'
import { SelectorType } from './types'
import { SelectorNode } from './index'
import { NotableSignal, getNotableItem } from '../_notables'
import { MetricGroup } from '../graph'

SelectorNode.SPENT_COIN_COST = {
  key: 'SPENT_COIN_COST',
  label: 'Transacted Coin Acquisition Cost',
  selectorType: SelectorType.ChartAddon,
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
  group: 'Fees',
  selectorType: SelectorType.Widget,
  checkIsVisible: ({ slug }) => slug === 'ethereum',
  isTopLevel: true,
}

SelectorNode.HoldersDistributionTable = {
  key: 'HoldersDistributionTable',
  label: 'Top Holders Table',
  group: MetricGroup.TopHolders,
  selectorType: SelectorType.Widget,
}

SelectorNode.TopTransactionsTable = {
  key: 'TopTransactionsTable',
  label: 'Top Transactions Table',
  group: 'Network Activity',
  shorthand: 'ttt',
  selectorType: SelectorType.Subwidget,
}

SelectorNode.TopExchangesTable = {
  key: 'TopExchangesTable',
  label: 'Holdings on the top exchanges',
  group: MetricGroup.Exchanges,
  shorthand: 'hte',
  selectorType: SelectorType.Widget,
}

SelectorNode.ProjectInTrends = Object.assign(
  getNotableItem(NotableSignal.project_in_trending_words),
  {
    checkIsVisible: ({ slug }) => slug !== 'ethereum' && slug !== 'bitcoin',
  },
)

export const Subitems = {
  [Metric.price_usd.key]: [SelectorNode.SPENT_COIN_COST],

  [Metric.social_volume_total.key]: [
    SelectorNode.SOCIAL_CONTEXT,
    Metric.social_active_users_telegram,
    Metric.social_active_users_twitter,
    // TODO: Uncomment when backend add support for this signal [@vanguard | Jun 30, 2021]
    SelectorNode.ProjectInTrends,
  ],

  [Metric.twitter_followers.key]: [Metric.twitter_followers_24h, Metric.twitter_followers_7d],
  [Metric.mvrv_usd.key]: Object.values(MvrvTimebounds),
  [Metric.mvrv_usd_intraday.key]: Object.values(MvrvUsdIntradayTimebounds),
  [Metric.realized_value_usd.key]: Object.values(RealizedCapTimebounds),
  [Metric.realized_cap_hodl_waves_0d_to_1d.key]: Object.values(RealizedCapHodlWavesTimebounds),

  [Metric.spent_coins_age_band_0d_to_1d.key]: Object.values(SpentCoinsAgeBandTimebounds),

  [Metric.circulation.key]: Object.values(CirculationTimebounds),
  [Metric.dormant_circulation_365d.key]: Object.values(DormantCirculationTimebounds),
  [Metric.mean_age.key]: Object.values(MeanAgeTimebounds),
  [Metric.mean_dollar_invested_age.key]: Object.values(MeanDollarInvestedAgeTimebounds),

  [Metric.eth2_stakers_realized_value_usd_365d.key]: Object.values(Eth2StakersRealizedTimebounds),
  [Metric.eth2_stakers_mvrv_usd_365d.key]: Object.values(Eth2StakersMvrvTimebounds),

  [Metric.median_fees_usd.key]: [SelectorNode.FeesDistribution],
  [Metric.amount_in_top_holders.key]: [SelectorNode.HoldersDistributionTable],

  [Metric.transaction_volume.key]: [SelectorNode.TopTransactionsTable],

  [Metric.amount_in_exchange_top_holders.key]: [SelectorNode.TopExchangesTable],
}

export const IsSubitem = {}
for (let key in Subitems) {
  const subitems = Subitems[key]
  for (let i = 0; i < subitems.length; i++) {
    const item = subitems[i] as any
    if (!item.isTopLevel) item.submetricOf = Metric[key]
    IsSubitem[item.key] = true
  }
}
