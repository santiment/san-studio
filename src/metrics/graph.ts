export enum MetricCategory {
  Financial = 'Financial',
  Social = 'Social',
  Development = 'Development',
  Derivatives = 'Derivatives',
  Indicators = 'Indicators',
  OnChain = 'On-chain',
  OnChainLabels = 'On-chain Labels',
}

export enum MetricGroup {
  // Social groups
  TotalSentiment = 'Total sentiment',
  RedditSentiment = 'Reddit sentiment',
  TelegramSentiment = 'Telegram sentiment',
  TwitterSentiment = 'Twitter sentiment',

  // On-chain groups
  SupplyDistribution = 'Supply distribution',

  //On-chain Labels groups
  Exchanges = 'Exchanges',
  TopHolders = 'Top Holders',
  ExchangeUsers = 'Exchange Users',
}

export type SelectorNode =
  | {
      key: string
      label: string
      group?: string
    }
  | Studio.Metric

export type SelectorGraph = {
  [K in MetricCategory]: SelectorNode[]
}
