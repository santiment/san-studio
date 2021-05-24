import { MetricCategory, MetricGroup } from './graph'
import { each } from './utils'
import { percentFormatter, axisPercentFormatter } from './formatters'
import { Node } from '@/Chart/nodes'

const TotalSentimentMetric = each(
  {
    sentiment_positive_total: {
      label: 'Positive sentiment (Total)',
    },
    sentiment_negative_total: {
      label: 'Negative sentiment (Total)',
    },
    sentiment_balance_total: {
      node: 'filledLine',
      label: 'Average Sentiment (Total)',
    },
    sentiment_volume_consumed_total: {
      node: 'filledLine',
      label: 'Weighted sentiment (Total)',
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TotalSentiment),
)

const TelegramSentimentMetric = each(
  {
    sentiment_positive_telegram: {
      label: 'Positive sentiment (Telegram)',
    },
    sentiment_negative_telegram: {
      label: 'Negative sentiment (Telegram)',
    },
    sentiment_balance_telegram: {
      node: 'filledLine',
      label: 'Average Sentiment (Telegram)',
    },
    sentiment_volume_consumed_telegram: {
      node: 'filledLine',
      label: 'Weighted sentiment (Telegram)',
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TelegramSentiment),
)

const TwitterSentimentMetric = each(
  {
    sentiment_positive_twitter: {
      label: 'Positive sentiment (Twitter)',
    },
    sentiment_negative_twitter: {
      label: 'Negative sentiment (Twitter)',
    },
    sentiment_balance_twitter: {
      node: 'filledLine',
      label: 'Average Sentiment (Twitter)',
    },
    sentiment_volume_consumed_twitter: {
      node: 'filledLine',
      label: 'Weighted sentiment (Twitter)',
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TwitterSentiment),
)

const RedditSentimentMetric = each(
  {
    sentiment_positive_reddit: {
      label: 'Positive sentiment (Reddit)',
    },
    sentiment_negative_reddit: {
      label: 'Negative sentiment (Reddit)',
    },
    sentiment_balance_reddit: {
      node: 'filledLine',
      label: 'Average Sentiment (Reddit)',
    },
    sentiment_volume_consumed_reddit: {
      node: 'filledLine',
      label: 'Weighted sentiment (Reddit)',
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.RedditSentiment),
)

const newTwitterFollowers = (interval: string) => ({
  queryKey: 'twitter_followers',
  label: `Twitter Followers ${interval}`,
  reqMeta: {
    interval,
    transform: { type: 'changes' },
  },
})

const newSocialActiveUsers = (
  channel: string,
  label: string,
  source = channel,
) => ({
  queryKey: 'social_active_users',
  label: `Active social users (${label})`,
  reqMeta: {
    channel,
    source,
  },
})

export const SocialMetric = each(
  {
    social_dominance_total: {
      label: 'Social Dominance',
      formatter: percentFormatter,
      axisFormatter: axisPercentFormatter,
    },

    social_volume_total: {
      node: Node.BAR,
      label: 'Social Volume',
    },

    social_active_users_telegram: newSocialActiveUsers('telegram', 'Telegram'),
    social_active_users_twitter: newSocialActiveUsers(
      'twitter',
      'Twitter',
      'twitter_crypto',
    ),

    twitter_followers: {
      label: 'Twitter Followers',
    },
    twitter_followers_24h: newTwitterFollowers('24h'),
    twitter_followers_7d: newTwitterFollowers('7d'),

    ...TotalSentimentMetric,
    ...TwitterSentimentMetric,
    ...TelegramSentimentMetric,
    ...RedditSentimentMetric,
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Social
  },
)
